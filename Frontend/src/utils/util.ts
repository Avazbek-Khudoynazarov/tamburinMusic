import imageCompression from 'browser-image-compression';

export const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const thumbnailImageCompress = async (fileSrc) => {
    const options = {
        maxSizeMB: 0.08,
        maxWidthOrHeight: 500,
        useWebWorker: true,
    };

    try {
        // 압축 결과
        const compressedFile = await imageCompression(fileSrc, options);
        return new File([compressedFile], "thumbnail_" + compressedFile.name);
        
        // const reader = new FileReader();
        // reader.readAsDataURL(compressedFile);
        // reader.onloadend = () => {
        //   const base64data = reader.result;
        //   imageHandling(base64data);
        // };
    } catch (error) {
        console.log(error);
    }
};

export const imageCompress = async (fileSrc) => {
    const options = {
        maxSizeMB: 0.7,
        maxWidthOrHeight: 2200,
        useWebWorker: true,
    };

    try {
        // 압축 결과
        const compressedFile = await imageCompression(fileSrc, options);
        return new File([compressedFile], compressedFile.name);
        
        // const reader = new FileReader();
        // reader.readAsDataURL(compressedFile);
        // reader.onloadend = () => {
        //   const base64data = reader.result;
        //   imageHandling(base64data);
        // };
    } catch (error) {
        console.log(error);
    }
};

export const detailImageCompress = async (fileSrc) => {
    const options = {
        maxSizeMB: 5,
        useWebWorker: true,
    };

    try {
        // 압축 결과
        const compressedFile = await imageCompression(fileSrc, options);
        return new File([compressedFile], compressedFile.name);
        
        // const reader = new FileReader();
        // reader.readAsDataURL(compressedFile);
        // reader.onloadend = () => {
        //   const base64data = reader.result;
        //   imageHandling(base64data);
        // };
    } catch (error) {
        console.log(error);
    }
};
