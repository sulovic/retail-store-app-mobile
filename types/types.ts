export type LoginData = {
  type: "password" | "google";
  email?: string;
  password?: string;
  credential?: string;
};

export type AuthUser = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  UserRoles: {
    roleId: number;
    roleName: string;
  };
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
  productDesc: string | null;
  productImage: string | null;
}


export type Store = {
  storeId: number;
  storeName: string;
  storeAddress: string;
}

export type Inventory = {
  inventoryId: number;
  inventoryDate: Date;
  Users: {
    userId: number;
    firstName: string;
    lastName: string;
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
  };
};
