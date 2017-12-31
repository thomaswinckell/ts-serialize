export type TypeDefinition<T> = {
    new (...args: any[]): T;
};

export type TypeListDefinition = (TypeDefinition<any>|(TypeDefinition<any>|(TypeDefinition<any>|(TypeDefinition<any>|(TypeDefinition<any>|(TypeDefinition<any>|(TypeDefinition<any>|(TypeDefinition<any>|(TypeDefinition<any>|TypeDefinition<any>[])[])[])[])[])[])[])[])[])[];

export type PrototypeListDefinition = (Object|(Object|(Object|(Object|(Object|(Object|(Object|(Object|(Object|Object[])[])[])[])[])[])[])[])[])[];

