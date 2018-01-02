export type TypeOperator = "|"|"&";

export type ArgTypeDefinition<T> = {
    new (...args: any[]): T;
}|Object|TypeOperator;

export type ArgsTypeListDefinition<T> = ArgTypeDefinition<T>|(ArgTypeDefinition<T>|(ArgTypeDefinition<T>|(ArgTypeDefinition<T>|(ArgTypeDefinition<T>|(ArgTypeDefinition<T>|(ArgTypeDefinition<T>|(ArgTypeDefinition<T>|(ArgTypeDefinition<T>|(ArgTypeDefinition<T>|ArgTypeDefinition<T>[])[])[])[])[])[])[])[])[])[];

export type TypeDefinition = Object|TypeOperator;

export type TypeListDefinition = (TypeDefinition|(TypeDefinition|(TypeDefinition|(TypeDefinition|(TypeDefinition|(TypeDefinition|(TypeDefinition|(TypeDefinition|(TypeDefinition|TypeDefinition[])[])[])[])[])[])[])[])[])[];

