import api from "./axios.instance";

export interface Comment {
    id: string;
    userId: string;
    content: string;
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
    user?: {
        id: string;
        name: string;
        email: string;
    };
}

export interface CreateCommentDto {
    userId?: string;
    content: string;
    imageUrl?: string;
}

export const commentApi = {
    createComment: async (data: CreateCommentDto, file?: any): Promise<Comment> => {
        try {
            const formData = new FormData();
            formData.append("content", data.content);
            if (data.userId) formData.append("userId", data.userId);

            if (file) {
                const fileUri = file.uri ? (file.uri.startsWith("file://") ? file.uri : `file://${file.uri}`) : null;
                
                if (fileUri) {
                    let fileType = "image/jpeg";
                    if (file.type && file.type.includes("/")) {
                        fileType = file.type;
                    } else {
                        const extension = fileUri.split('.').pop()?.toLowerCase();
                        if (extension === 'png') fileType = 'image/png';
                        if (extension === 'gif') fileType = 'image/gif';
                    }

                    formData.append("image", {
                        uri: fileUri,
                        type: fileType,
                        name: file.fileName || `photo_${Date.now()}.jpg`,
                    } as any);
                }
            }

            const response = await api.post("/comments", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error: any) {
            throw error;
        }
    },

    getComments: async (params?: {
        skip?: number;
        take?: number;
        cursor?: any;
        where?: any;
        orderBy?: any;
    }): Promise<{ data: Comment[]; total: number }> => {
        try {
            const response = await api.get("/comments", { params });
            return response.data;
        } catch (error: any) {
            throw error;
        }
    },

    getCommentById: async (id: string): Promise<Comment> => {
        try {
            const response = await api.get(`/comments/${id}`);
            return response.data;
        } catch (error: any) {
            throw error;
        }
    },

    getCommentsByUserId: async (userId: string): Promise<Comment[]> => {
        try {
            const response = await api.get(`/comments/user/${userId}`);
            return response.data;
        } catch (error: any) {
            throw error;
        }
    },

    updateComment: async (id: string, data: Partial<CreateCommentDto>, file?: any): Promise<Comment> => {
        try {
            const formData = new FormData();
            if (data.content) formData.append("content", data.content);

            if (file) {
                if (file.uri) {
                    formData.append("file", {
                        uri: file.uri,
                        type: file.type || "image/jpeg",
                        name: file.name || "comment_image.jpg",
                    } as any);
                } else {
                    formData.append("file", file);
                }
            }

            const response = await api.put(`/comments/${id}`, formData);
            return response.data;
        } catch (error: any) {
            throw error;
        }
    },

    deleteComment: async (id: string): Promise<any> => {
        try {
            const response = await api.delete(`/comments/${id}`);
            return response.data;
        } catch (error: any) {
            throw error;
        }
    },

    countComments: async (where?: any): Promise<number> => {
        try {
            const response = await api.get("/comments/count", { params: { where } });
            return response.data;
        } catch (error: any) {
            throw error;
        }
    },
};
