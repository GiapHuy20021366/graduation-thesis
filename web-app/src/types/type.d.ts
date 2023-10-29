declare global {
    interface Window {
        google: any;
    }

    interface String {
        format(...params: any[]): string;
    }
}

String.prototype.format = function (...params: any[]): string {
    const d: string = String(this);
    return d + params.join(",");
}

export {};