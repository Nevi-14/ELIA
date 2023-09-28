
export const justificaciones = [
    {
        id: 'FNE',
        valor: 'Facturado No Entregado',
    },
    {
        id: 'VE',
        valor: 'Venta Extraordinaria',
    },
    {
        id: 'FPV',
        valor: 'Faltante PDV',
    },
    {
        id: 'FDI',
        valor: 'Faltante Isleña',
    },
];

export interface Justificacion {
    id: string;
    valor: string;
}
