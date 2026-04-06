import { commentApi, Comment, CreateCommentDto } from "../../../services/api/apiComment";
import { useState } from "react";

export const useComment = () => {
    const [mess, setMess] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [comments, setComments] = useState<Comment[]>([]);
    const [total, setTotal] = useState<number>(0);

    const createComment = async (data: CreateCommentDto, file?: any) => {
        setLoading(true);
        setError("");
        try {
            const comment = await commentApi.createComment(data, file);
            setComments((prev) => [comment, ...prev]);
            setTotal((prev) => prev + 1);
            setMess("Bình luận thành công");
        } catch (err: any) {
            console.error("Hook createComment error:", err.response?.data || err.message);
            setError(err.message);
            setMess("Bình luận thất bại");
        } finally {
            setLoading(false);
        }
    };

    const getComments = async (params?: any) => {
        setLoading(true);
        setError("");
        try {
            const { data, total } = await commentApi.getComments(params);
            setComments(data);
            setTotal(total);
        } catch (err: any) {
            console.error("Hook getComments error:", err.response?.data || err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getCommentById = async (id: string) => {
        setLoading(true);
        setError("");
        try {
            const comment = await commentApi.getCommentById(id);
            return comment;
        } catch (err: any) {
            console.error("Hook getCommentById error:", err.response?.data || err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getCommentsByUserId = async (userId: string) => {
        setLoading(true);
        setError("");
        try {
            const commentsResult = await commentApi.getCommentsByUserId(userId);
            setComments(commentsResult);
        } catch (err: any) {
            console.error("Hook getCommentsByUserId error:", err.response?.data || err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateComment = async (id: string, data: Partial<CreateCommentDto>, file?: any) => {
        setLoading(true);
        setError("");
        try {
            const comment = await commentApi.updateComment(id, data, file);
            setComments((prev) => prev.map((c) => (c.id === id ? comment : c)));
            setMess("Cập nhật bình luận thành công");
        } catch (err: any) {
            console.error("Hook updateComment error:", err.response?.data || err.message);
            setError(err.message);
            setMess("Cập nhật bình luận thất bại");
        } finally {
            setLoading(false);
        }
    };

    const deleteComment = async (id: string) => {
        setLoading(true);
        setError("");
        try {
            await commentApi.deleteComment(id);
            setComments((prev) => prev.filter((c) => c.id !== id));
            setTotal((prev) => prev - 1);
            setMess("Xóa bình luận thành công");
        } catch (err: any) {
            console.error("Hook deleteComment error:", err.response?.data || err.message);
            setError(err.message);
            setMess("Xóa bình luận thất bại");
        } finally {
            setLoading(false);
        }
    };

    const countComments = async (where?: any) => {
        setLoading(true);
        setError("");
        try {
            const count = await commentApi.countComments(where);
            setTotal(count);
        } catch (err: any) {
            console.error("Hook countComments error:", err.response?.data || err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        mess,
        setMess,
        loading,
        error,
        comments,
        total,
        createComment,
        getComments,
        getCommentById,
        getCommentsByUserId,
        updateComment,
        deleteComment,
        countComments,
    };
}