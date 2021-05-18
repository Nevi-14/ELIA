
export class Productos {
    id: string;
    idCliente: string;
    nombre: string;
    precio: number;
    codigoBarras: string;
    barrasCliente: string;
    stock: number;          // 0 = normal; 1 = bajo Stock; -1 = faltante
    seleccionado: boolean;
    imagen: string;

    constructor ( id: string, idCliente: string, nombre: string, precio: number, codBar: string, barCliente: string ){
        this.id = id;
        this.idCliente = idCliente;
        this.nombre = nombre;
        this.precio = precio;
        this.codigoBarras = codBar;
        this.barrasCliente = barCliente;
        this.stock = 0;
        this.seleccionado = false;
        this.imagen = "../../../assets/icon/ok.png";
    }
}

export const SKUS = [{
    id: '2770',
    idCliente: '39643',
    nombre: 'ACEITE AJO',
    precio: 0,
    codigoBarras: '041224706941',
    barrasCliente: '041224706941',
    stock: 0,
    seleccionado: false,
    imagen: "../../../assets/icon/ok.png",
},
{ 
    id: '2771',
    idCliente: '208256',
    nombre: 'ACEITE JENGIBRE',
    precio: 0,
    codigoBarras: '041224706965',
    barrasCliente: '041224706965',
    stock: 0,
    seleccionado: false,
    imagen: "../../../assets/icon/ok.png",
},
{
    id: '2550',
    idCliente: '500703',
    nombre: 'ACEITE OLI EXTRA V',
    precio: 0,
    codigoBarras: '048327203513',
    barrasCliente: '048327203513',
    stock: 0,
    seleccionado: false,
    imagen: "../../../assets/icon/ok.png",
},
{
    id: '2307',
    idCliente: '500740',
    nombre: 'ACEITE SESAMO',
    precio: 0,
    codigoBarras: '041224871229',
    barrasCliente: '041224871229',
    stock: 0,
    seleccionado: false,
    imagen: "../../../assets/icon/ok.png",
},
{
    id: '2548',
    idCliente: '48252',
    nombre: 'ACEITUNA GORDAL SIN SEMILLA',
    precio: 0,
    codigoBarras: '8410086974218',
    barrasCliente: '8410086974218',
    stock: 0,
    seleccionado: false,
    imagen: "../../../assets/icon/ok.png",
},
{
    id: '11284',
    idCliente: '197406',
    nombre: 'AGUA GASIFICADA ARANDANO CAFE',
    precio: 0,
    codigoBarras: '016571953843',
    barrasCliente: '016571953843',
    stock: 0,
    seleccionado: false,
    imagen: "../../../assets/icon/ok.png",
},
{
    id: '11750',
    idCliente: '215142',
    nombre: 'AGUA GASIFICADA COCO LIMON',
    precio: 0,
    codigoBarras: '016571954772',
    barrasCliente: '016571954772',
    stock: 0,
    seleccionado: false,
    imagen: "../../../assets/icon/ok.png",
}
]
