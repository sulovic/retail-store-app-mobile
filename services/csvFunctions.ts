import * as DocumentPicker from "expo-document-picker";
import * as XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import Papa from "papaparse";
import { Toast } from "toastify-react-native";
import { Product, CsvData, InventoryProduct, Inventory } from "../types/types";
import { formatDate } from "date-fns";

const exportXLS = async (data: (string | number)[][]) => {
  try {
    // Convert data to a worksheet
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Create a workbook and append the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Write workbook as base64
    const excelData = XLSX.write(wb, { type: "base64", bookType: "xlsx" });

    // Define file path
    const fileUri = FileSystem.documentDirectory + "export.xlsx";

    // Write the base64 data to a file
    await FileSystem.writeAsStringAsync(fileUri, excelData, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Share the file
    await Sharing.shareAsync(fileUri);
  } catch (error) {
    Toast.error("Greška prilikom obrade podataka.", "top");
  }
};

const importCSV = async (): Promise<CsvData[]> => {
  try {
    // Pick a single CSV file
    const res = await DocumentPicker.getDocumentAsync({
      type: ["text/csv", "application/vnd.ms-excel"],
    });

    if (res.canceled) {
      Toast.error("Korisnik je otkazao otpremanje", "top");
      return [];
    }

    if (!res.assets || res.assets.length === 0) {
      Toast.error("Nije odabran ispravan fajl", "top");
      return [];
    }

    const fileUri = res.assets[0].uri;

    // Fetch the file content
    const fileContent = await (await fetch(fileUri)).text();

    return new Promise<CsvData[]>((resolve, reject) => {
      Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          // Resolve with the parsed data
          resolve(results.data as CsvData[]);
        },
        error: (err: any) => {
          Toast.error("Greška prilikom obrade podataka.", "top");
          reject([]);
        },
      });
    });
  } catch (err) {
    Toast.error("Došlo je do greške prilikom učitavanja", "top");
    return []; // Return empty array if an error occurs
  }
};

const prepareProductData = (data: CsvData[]): Omit<Product, "productId">[] => {
  const preparedData = data
    .filter((item) => item.productBarcode && item.productPrice && item.productName)
    .map((item) => {
      const productData: Omit<Product, "productId"> = {
        productName: item.productName as string,
        productBarcode: item.productBarcode as string,
        productPrice: parseFloat(parseFloat((item.productPrice as string).replace(",", ".")).toFixed(2)),
      };

      // Conditionally add productDesc if provided
      if (item.productDesc) {
        productData.productName = item.productDesc as string;
      }

      // Conditionally add productImage if provided
      if (item.productImage) {
        productData.productImage = item.productImage as string;
      }

      return productData;
    });
  return preparedData;
};

const exportInventoryProductList = ({
  inventory,
  inventoryProductsList,
}: {
  inventory: Inventory;
  inventoryProductsList: InventoryProduct[];
}) => {
  let inventorySum: number = 0;
  const inventoryList: any[] = [];

  inventoryList.push([
    "Prodavnica",
    inventory.Stores.storeName,
    "",
    "Datum",
    formatDate(inventory.inventoryDate, "dd.MM.yyyy."),
  ]);
  inventoryList.push(["RB", "Naziv proizvoda", "Barkod", "Kolicina", "Cena", "Ukupno"]);

  inventoryProductsList.map((item, index) => {
    inventoryList.push([
      index + 1,
      item.Products.productName,
      item.Products.productBarcode,
      item.productQuantity,
      item.productPrice,
      item.productPrice * item.productQuantity,
    ]);
    inventorySum += item.productPrice * item.productQuantity;
  });

  inventoryList.push(["", "", "", "", "Ukupno:", inventorySum]);

  exportXLS(inventoryList);
};

export { exportXLS, importCSV, prepareProductData, exportInventoryProductList };
