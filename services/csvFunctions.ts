import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import Papa from "papaparse";
import { Toast } from "toastify-react-native";
import { Product, CsvData } from "../types/types";

const exportCSV = async (data: CsvData[]) => {
  try {
    const csv = Papa.unparse(data);

    const fileUri = FileSystem.documentDirectory + "export.csv";

    await FileSystem.writeAsStringAsync(fileUri, csv, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    await Sharing.shareAsync(fileUri);

    await FileSystem.deleteAsync(fileUri);
  } catch (error) {
    Toast.error("Greška pri obradi podataka.", "top");
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
  console.log("Received data:", data);
  const preparedData = data
    .filter((item) => item.productBarcode && item.productPrice && item.productName)
    .map((item) => {
      const productData: Omit<Product, "productId"> = {
        productName: item.productName as string,
        productBarcode: item.productBarcode as string,
        productPrice: parseFloat((item.productPrice as string).replace(",", ".")),
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

  console.log("Prepared data:", preparedData);
  return preparedData;
};

export { exportCSV, importCSV, prepareProductData };
