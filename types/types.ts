export type LoginData = {
  type: "password" | "google";
  email?: string;
  password?: string;
  credential?: string;
};

export type UserRole = {
  roleId: number;
  roleName: string;
};

export type AuthUser = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  UserRoles: UserRole;
  Stores: {
    storeId: number;
    storeName: string;
    storeAddress: string;
  }[];
};
export type AxiosLoginResponse = {
  data: { accessToken: string };
};

export type AuthContextType = {
  authUser: AuthUser | null;
  setAuthUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
  accessToken: string | null;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
  handleLogin: (data: LoginData) => Promise<void>;
  handleLogout: () => Promise<void>;
  handleRefreshToken: () => Promise<string | undefined>;
};

export type Product = {
  productId: number;
  productBarcode: string;
  productName: string;
  productPrice: number;
  productDesc?: string;
  productImage?: string;
};

export type Store = {
  storeId: number;
  storeName: string;
  storeAddress: string;
  Users: {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
  }[];
};
export type NewInventory = {
  storeId: number;
  creatorId: number;
  inventoryDate: Date;
  archived: boolean;
};

export type Inventory = {
  inventoryId: number;
  inventoryDate: Date;
  Creator: {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  Stores: Store;
  archived: boolean;
};

export type InventoryProduct = {
  inventoryProductId: number;
  inventoryId: number;
  productPrice: number;
  productQuantity: number;
  Users: {
    userId: number;
    firstName: string;
    lastName: string;
  };
  Products: {
    productId: number;
    productName: string;
    productBarcode: string;
  };
};

export type NewInventoryProduct = {
  inventoryId: number;
  productId: number;
  productPrice: number;
  productQuantity: number;
  userId: number;
};

export type PaginationType = {
  limit: 10 | 25 | 50 | 100;
  page: number;
  count: number;
};

export type FilterType= {
productName?: string;
productBarcode?: string;
};

export type CsvData = { [key: string]: string | number };

