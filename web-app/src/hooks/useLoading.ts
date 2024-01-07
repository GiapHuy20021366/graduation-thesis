import { useCallback, useState } from "react";

export function useLoading(init?: boolean) {
    const [loading, setLoading] = useState<boolean>(init ?? false);

    const active = useCallback(() => {
        setLoading(true);
    }, [])

    const deactive = useCallback(() => {
        setLoading(false);
    }, [])

    return {
        val: loading,
        setVal: setLoading,
        isActice: loading,
        active: active,
        deactive: deactive
    }
}