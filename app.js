function removeLastFourDigits(qris) {
    return qris.slice(0, -4);
}

function ConvertCRC16(str) {
    let crc = 0xffff;
    let strlen = str.length;
    for (let c = 0; c < strlen; c++) {
        crc ^= str.charCodeAt(c) << 8;
        for (let i = 0; i < 8; i++) {
            if (crc & 0x8000) {
                crc = (crc << 1) ^ 0x1021;
            } else {
                crc = crc << 1;
            }
        }
    }
    let hex = crc & 0xffff;
    hex = hex.toString(16).toUpperCase();
    if (hex.length == 3) hex = "0" + hex;
    return hex;
}

function checkSum(newQris) {
    return newQris + ConvertCRC16(newQris);
}

function initNewQris(dataQrisOriginal, arrayMerchantBaru) {
    let newQris = dataQrisOriginal;

    dataQrisOriginal = removeLastFourDigits(dataQrisOriginal);

    const qrisPart = (dataQrisOriginal) => {
        return dataQrisOriginal.substring(0, dataQrisOriginal.length - 43);
    };

    // Create MerchantName with templte 59<length><merchantName>
    const merchantName = (merchantName) => {
        let merchantNameLength = merchantName.length;

        // add prefix 0 if length is less than 9
        if (merchantNameLength < 9) {
            merchantNameLength = "0" + merchantNameLength;
        }

        return (merchantName = "59" + merchantNameLength + merchantName);
    };

    const merchantCity = (merchantCity) => {
        let merchantCityLength = merchantCity.length;

        // add prefix 0 if length is less than 9
        if (merchantCityLength < 9) {
            merchantCityLength = "0" + merchantCityLength;
        }

        return (merchantCity = "60" + merchantCityLength + merchantCity);
    };

    const merchantPostalCode = (merchantPostalCode) => {
        let merchantPostalCodeLength = merchantPostalCode.length;

        // add prefix 0 if length is less than 10
        if (merchantPostalCodeLength < 9) {
            merchantPostalCodeLength = "0" + merchantPostalCodeLength;
        }

        return (merchantPostalCode =
            "61" + merchantPostalCodeLength + merchantPostalCode);
    };

    // update qris
    newQris =
        qrisPart(dataQrisOriginal) +
        merchantName(arrayMerchantBaru[0]) +
        merchantCity(arrayMerchantBaru[1]) +
        merchantPostalCode(arrayMerchantBaru[2]) +
        "6304";

    return checkSum(newQris);
}

// Fungsi untuk mencetak kode QR ke terminal
async function printQRCode(data) {
    try {
        const options = {
            type: "terminal",
            small: true,
        };
        const qrCode = await qrcode.toString(data, options);
        console.log(qrCode);
    } catch (error) {
        console.error(error);
    }
}

let dataQrisOriginal =
    "00020101021126570011ID.DANA.WWW011893600915326312820102092631282010303UMI51440014ID.CO.QRIS.WWW0215ID10221697408450303UMI5204729853033605802ID5912Cipta Sukses6010Kota Batam61052942663048956";

// retrive data from id merchant-name
document.addEventListener("DOMContentLoaded", function () {
    const generateQRCodeBtn = document.getElementById("generate-qrcode-btn");
    const qrCodeContainer = document.getElementById("qrcode-container");

    generateQRCodeBtn.addEventListener("click", function () {
        const merchantName = document.getElementById("merchant-name").value;
        const merchantCity = document.getElementById("merchant-city").value;
        const postalCode = document.getElementById("postal-code").value;

        const arrayMerchantBaru = [merchantName, merchantCity, postalCode];

        const qrCodeUrl = `https://chart.googleapis.com/chart?cht=qr&chl=${initNewQris(
            dataQrisOriginal,
            arrayMerchantBaru
        )}&chs=300x300`;

        qrCodeContainer.innerHTML = `<img src="${qrCodeUrl}" alt="QR Code">`;
    });
});
