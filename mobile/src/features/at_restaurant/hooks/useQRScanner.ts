import { useState, useRef } from "react";
import { Alert } from "react-native";
import { useCameraPermissions } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import { tableApi } from "../../../services/api/api-table";

export const useQRScanner = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const isProcessing = useRef(false);
  const navigation = useNavigation<any>();

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned || isProcessing.current) return;
    
    isProcessing.current = true;
    setScanned(true);

    try {
      const scannedText = data.trim();
      let tableIdentifier = null;

      const urlMatch = scannedText.match(/table\/([a-zA-Z0-9-]+)/i);
      if (urlMatch && urlMatch[1]) {
        tableIdentifier = urlMatch[1];
      } 
      else if (/^\d+$/.test(scannedText)) {
        tableIdentifier = scannedText;
      }
      else if (scannedText.toLowerCase().includes('bàn')) {
        const numMatch = scannedText.match(/\d+/);
        if (numMatch) {
            tableIdentifier = numMatch[0];
        }
      }
      else if (scannedText.includes('/')) {
        const parts = scannedText.split('/');
        const last = parts[parts.length - 1];
        if (last && /^[a-zA-Z0-9-]+$/.test(last)) {
          tableIdentifier = last;
        }
      }

      if (tableIdentifier) {
        let table = null;
        
        try {
          if (!isNaN(Number(tableIdentifier))) {
            try {
                table = await tableApi.getTableById(Number(tableIdentifier));
            } catch (e) { }
          }

          if (!table) {
            try {
                table = await tableApi.getTableByQr(tableIdentifier);
            } catch (e) { }
          }
          
          if (!table && !isNaN(Number(tableIdentifier))) {
            try {
                table = await tableApi.getTableByQr(`Bàn ${tableIdentifier}`);
            } catch (e) { }
          }
        } catch (apiError) { }

        if (table) {
          Alert.alert(
            "Xác nhận",
            `Bạn đang ngồi tại ${table.name}?`,
            [
              {
                text: "Hủy",
                onPress: () => {
                   isProcessing.current = false;
                   setTimeout(() => setScanned(false), 500);
                },
                style: "cancel",
              },
              {
                text: "Đúng, bắt đầu gọi món",
                onPress: () => {
                  navigation.navigate("AtRestaurant", {
                    scannedTableId: table.id,
                    scannedTableName: table.name,
                    initialTab: "menu"
                  });
                  setTimeout(() => {
                    isProcessing.current = false;
                    setScanned(false);
                  }, 1000);
                },
              },
            ],
            { cancelable: false }
          );
        } else {
          Alert.alert("Lỗi", `Không tìm thấy bàn nào ứng với: ${tableIdentifier}`, [
            { text: "Quét lại", onPress: () => {
                isProcessing.current = false;
                setTimeout(() => setScanned(false), 500);
            }}
          ], { cancelable: false });
        }
      } else {
        Alert.alert("Lỗi", "Mã QR không hợp lệ.\n\n(Nội dung: " + scannedText + ")", [
          { text: "OK", onPress: () => {
              isProcessing.current = false;
              setTimeout(() => setScanned(false), 500);
          }}
        ], { cancelable: false });
      }
    } catch (error) {
      Alert.alert("Lỗi", "Hệ thống gặp sự cố khi đọc mã QR.", [
        { text: "Thử lại", onPress: () => {
            isProcessing.current = false;
            setTimeout(() => setScanned(false), 500);
        }}
      ], { cancelable: false });
    }
  };

  return {
    permission,
    requestPermission,
    scanned,
    handleBarCodeScanned,
    goBack: () => navigation.goBack(),
  };
};
