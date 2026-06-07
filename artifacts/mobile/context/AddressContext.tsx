import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export type AddressLabel = "home" | "work" | "other";

export type SavedAddress = {
  id: string;
  label: AddressLabel;
  flat: string;
  building: string;
  area: string;
  city: string;
  pincode: string;
  isDefault: boolean;
  icon: "home" | "briefcase" | "map-pin";
};

type AddressContextType = {
  addresses: SavedAddress[];
  addAddress: (addr: Omit<SavedAddress, "id">) => Promise<void>;
  removeAddress: (id: string) => Promise<void>;
  setDefault: (id: string) => Promise<void>;
};

const STORAGE_KEY = "@bringo_addresses";

const DEFAULT_ADDRESSES: SavedAddress[] = [
  {
    id: "default_1",
    label: "home",
    flat: "Flat 4B",
    building: "Sunrise Apartments",
    area: "Koramangala 5th Block",
    city: "Bengaluru",
    pincode: "560034",
    isDefault: true,
    icon: "home",
  },
  {
    id: "default_2",
    label: "work",
    flat: "WeWork Galaxy, 43",
    building: "Residency Road",
    area: "MG Road",
    city: "Bengaluru",
    pincode: "560025",
    isDefault: false,
    icon: "briefcase",
  },
];

const AddressContext = createContext<AddressContextType>({
  addresses: DEFAULT_ADDRESSES,
  addAddress: async () => {},
  removeAddress: async () => {},
  setDefault: async () => {},
});

export function AddressProvider({ children }: { children: React.ReactNode }) {
  const [addresses, setAddresses] = useState<SavedAddress[]>(DEFAULT_ADDRESSES);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAddresses(parsed);
          }
        } catch {}
      }
    });
  }, []);

  const persist = useCallback(async (list: SavedAddress[]) => {
    setAddresses(list);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }, []);

  const addAddress = useCallback(
    async (addr: Omit<SavedAddress, "id">) => {
      const newAddr: SavedAddress = {
        ...addr,
        id: Date.now().toString(),
      };
      const updated = addr.isDefault
        ? [...addresses.map((a) => ({ ...a, isDefault: false })), newAddr]
        : [...addresses, newAddr];
      await persist(updated);
    },
    [addresses, persist]
  );

  const removeAddress = useCallback(
    async (id: string) => {
      const updated = addresses.filter((a) => a.id !== id);
      await persist(updated);
    },
    [addresses, persist]
  );

  const setDefault = useCallback(
    async (id: string) => {
      const updated = addresses.map((a) => ({ ...a, isDefault: a.id === id }));
      await persist(updated);
    },
    [addresses, persist]
  );

  return (
    <AddressContext.Provider value={{ addresses, addAddress, removeAddress, setDefault }}>
      {children}
    </AddressContext.Provider>
  );
}

export function useAddresses() {
  return useContext(AddressContext);
}

export function formatAddress(addr: SavedAddress): string {
  const parts = [addr.flat, addr.building, addr.area, addr.city, addr.pincode].filter(Boolean);
  return parts.join(", ");
}
