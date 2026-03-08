import { useState, useCallback } from "react";
import { packageApi } from "../../../services/api/package-api";

export const usePackage = () => {
    const [packages, setPackages] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState({
        search: "",
        limit: 1000,
    });

    const fetchPackages = useCallback(
        async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await packageApi.findAll();
                setPackages(data);
            } catch (err) {
                setError(err as any);
                console.warn("Fetch packages error:", err);
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    return {
        packages,
        loading,
        error,
        filter,
        setPackages,
        setLoading,
        setError,
        setFilter,
        fetchPackages,
    };
};