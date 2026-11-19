import { useState, useCallback, useRef } from "react";
import packageApi, { Package } from "../../../services/api/package-api";

export const useAdminPackage = () => {
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(false);
    const isFetchingRef = useRef(false);

    const fetchPackages = useCallback(async () => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;
        setLoading(true);
        try {
            const data = await packageApi.findAllPackage();
            setPackages(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching packages:", error);
        } finally {
            setLoading(false);
            isFetchingRef.current = false;
        }
    }, []);

    return { packages, loading, refresh: fetchPackages };
};
