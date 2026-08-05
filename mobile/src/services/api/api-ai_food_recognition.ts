import api from "./axios.instance";

const aiFoodRecognitionApi = {
    recognize: async (imageBase64: string, userPrompt?: string) => {
        const response = await api.post("/ai/food-recognition/recognize", {
            imageBase64,
            userPrompt,
        });
        return response.data;
    },
};

export default aiFoodRecognitionApi;


