interface Constructor< T > {
    new(...args : any[]) : T;
    name : string;
}

export default Constructor