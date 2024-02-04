export const BASE64 = {
  from: (file: File, fn: (result: string | ArrayBuffer | null) => void) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (result != null) {
        fn(result.toString());
      }
    };

    reader.readAsDataURL(file);
  },
};
