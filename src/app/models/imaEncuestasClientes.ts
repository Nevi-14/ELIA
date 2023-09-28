export class ImaEncuestasClientes {
    constructor(
    public id:    number,
    public linea:    number,
    public repeticioneS_RESTANTES:    number,
    public cliente: string,
    public aplicado:     string,
    public fechA_APLICADO:   Date
    ){}
}
