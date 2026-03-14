import { useState, useEffect } from "react";
import packageApi, { Package } from "../../../services/api/package-api";

export const useAdminPackage = () => {
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchPackages = async () => {
        setLoading(true);
        try {
            const data = await packageApi.findAllPackage();
            setPackages(data);
        } catch (error) {
            console.error("Error fetching packages:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    return { packages, loading, refresh: fetchPackages };
};