import React, { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { useRouter, usePathname, Stack } from "expo-router";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import ThemedLink from "@/components/ThemedLink";
import MyButton from "@/components/ThemedButton";
import { Drawer } from "expo-router/drawer";
import { useColorScheme } from "@/hooks/useColorScheme";
import privilegesSchema from "@/constants/privilegesSchema";
import { Href } from "expo-router";

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authUser, handleLogout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const colorScheme = useColorScheme();
  const [mounted, setMounted] = useState(false);

  const menuItems : { label: string; href: Href; subItems?: { label: string; href: Href }[] }[] = [
    {
      label: "Popisi",
      href: "/protected/inventory/InventoriesScreen",
      subItems: [
        {
          label: "Aktivni popisi",
          href: "/protected/inventory/active-inventories/ActiveInventoriesScreen",
        },
        {
          label: "Uredi popise",
          href: "/protected/inventory/manage-inventories/ManageInventoriesScreen",
        },
        {
          label: "Nov popis",
          href: "/protected/inventory/new-inventory/NewInventoryScreen",
        },
      ],
    },
    {
      label: "Nabavke",
      href: "/protected/procurment/ProcurementScreen",
    },
    {
      label: "Proizvodi",
      href: "/protected/products/ProductsScreen",
      subItems: [
        {
          label: "Pregled proizvoda",
          href: "/protected/products/product-list/ProductsListScreen",
        },
        {
          label: "Dodaj novi proizvod",
          href: "/protected/products/new-product/NewProductScreen",
        },
        {
          label: "Skeniraj novi proizvod",
          href: "/protected/products/scan-new-product/ScanNewProductScreen",
        },{
          label: "Učitaj listu proizvoda",
          href: "/protected/products/upload-products/UploadProductsScreen",
        },
      ],
    },
    {
      label: "Korisnici",
      href: "/protected/users/UsersScreen",
    },       
  ];

  function CustomDrawerContent() {
    return (
      <ThemedView style={{ flex: 1, paddingHorizontal: 10, paddingVertical: 20, gap: 10 }}>
        <ThemedText type="defaultSemiBold">Retail Store APP</ThemedText>

        <ThemedLink key="/protected/home/HomeScreen" type="defaultSemiBold" href="/protected/home/HomeScreen" style={{ marginLeft: 20 }}>
          Home
        </ThemedLink>
        {menuItems.map(
          (item, index) =>
            authUser &&
            authUser.UserRoles.roleId > privilegesSchema[item.href as keyof typeof privilegesSchema]  && (
              <React.Fragment key={`menuItem-${index}`}>
                <ThemedLink key={item.href as string} type="defaultSemiBold" href={item.href} style={{ marginLeft: 20 }}>
                  {item.label}
                </ThemedLink>
                {item.subItems?.map(
                  (subItem) =>
                    authUser &&
                    authUser.UserRoles.roleId > privilegesSchema[subItem.href as keyof typeof privilegesSchema]  && (
                      <ThemedLink key={subItem.href as string} type="default" href={subItem.href} style={{ marginLeft: 40 }}>
                        {subItem.label}
                      </ThemedLink>
                    )
                )}
              </React.Fragment>
            )
        )}

        <ThemedView style={{ paddingHorizontal: 10, paddingVertical: 20, gap: 10 }}>
          <ThemedText type="defaultSemiBold">
            {authUser?.firstName} {authUser?.lastName}
          </ThemedText>
          <MyButton type="secondary" title="Odjavi se" onPress={() => handleLogout()} />
        </ThemedView>
      </ThemedView>
    );
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!authUser && mounted && pathname !== "/") {
      router.push("/");
    }
    if (authUser?.UserRoles?.roleId !== undefined && authUser.UserRoles.roleId < (privilegesSchema[pathname as keyof typeof privilegesSchema] || Infinity)) {
      router.push("/protected/home/HomeScreen");
    }
  }, [authUser, mounted, router, pathname]);

  if (!authUser) {
    return null;
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false, animation: "slide_from_right" }} />
      <Drawer
        drawerContent={CustomDrawerContent}
        screenOptions={{
          headerTintColor: colorScheme === "dark" ? "#fff" : "#000",
        }}
      />
      {children}
    </>
  );
};

export default ProtectedLayout;
