/* tslint:disable:no-use-before-declare */

import {Optional, Some, None} from './Optional'


/**
 * Represents a value of one of two possible types (a disjoint union.)
 * An instance of Either is either an instance of Left or Right.
 *
 * A common use of Either is as an alternative to Option for dealing
 * with possible missing values.  In this usage, None is replaced
 * with a Left which can contain useful information.
 * Right takes the place of Some.  Convention dictates
 * that Left is used for failure and Right is used for success.
 */
export interface Either<A, B> {
    readonly value: A | B;
    /**
     * Returns `true` if this is a `Left`, `false` otherwise.
     */
    readonly isLeft: boolean;
    /**
     * Returns `true` if this is a `Right`, `false` otherwise.
     */
    readonly isRight: boolean;
    /**
     * Projects this `Either` as a `Right`.
     */
    left(): LeftProjection<A, B>;
    /**
     * Projects this `Either` as a `Right`.
     */
    right(): RightProjection<A, B>;
    /**
     * Applies `fa` if this is a `Left` or `fb` if this is a `Right`.
     * @param fa the function to apply if this is a `Left`
     * @param fb the function to apply if this is a `Right`
     */
    fold<X>(fa: (a: A) => X, fb: (b: B) => X): X;
    /**
     * If this is a `Left`, then return the left value in `Right` or vice versa.
     */
    swap(): Either<B, A>;
    /**
     * Executes the given side-effecting function if this is a `Right`.
     * @param f The side-effecting function to execute.
     */
    foreach(f: (b: B) => void): void;
    /**
     * Returns the value from this `Right` or the given argument if this is a `Left`.
     * @param dv default value
     */
    getOrElse(dv: () => B): B;
    /**
     * Returns `true` if this is a `Right` and its value is equal to `elem` (as determined by `==`),
     * returns `false` otherwise.
     * @param elem
     */
    contains(elem: B): boolean;
    /**
     * Returns `true` if `Left` or returns the result of the application of
     * the given function to the `Right` value.
     */
    forall(f: (v: B) => boolean): boolean;
    /**
     * Returns `false` if `Left` or returns the result of the application of
     * the given function to the `Right` value.
     * @param f predicate
     */
    exists(f: (v: B) => boolean): boolean;
    /**
     * The given function is applied if this is a `Right`.
     * @param f
     */
    map<Y>(f: (v: B) => Y): Either<A, Y>;
    /**
     * Binds the given function across `Right`.
     * @param f
     */
    flatMap<Y>(f: (v: B) => Either<A, Y>): Either<A, Y>;
    /**
     * Returns a `Some` containing the `Right` value
     * if it exists or a `None` if this is a `Left`.
     */
    toOptional(): Optional<B>;
    /**
     * Match function. will call pf.Left if this is a `Left` or pf.Right if this is a `Right`.
     * @param pf partial function.
     */
    match<C>(pf: {Left: (v: A) => C, Right: (v: B) => C}): C;

    //
    /** @override */
    chain<C>(ob: Either<any, C>): EitherBuilder1<B, C>;

    apply1<C, D>(ob: Either<A, C>, f: (a: B, b: C) => D): Either<A, D>;
    apply2<C, D, E>(ob: Either<A, C>, oc: Either<A, D>, f: (a: B, b: C, c: D) => E): Either<A, E>;
    apply3<C, D, E, F>(ob: Either<A, C>, oc: Either<A, D>, od: Either<A, E>, f: (a: B, b: C, c: D, d: E) => F): Either<A, F>;
    apply4<C, D, E, F, G>(ob: Either<A, C>, oc: Either<A, D>, od: Either<A, E>, oe: Either<A, F>, f: (a: B, b: C, c: D, d: E, e: F) => G): Either<A, G>;
    apply5<C, D, E, F, G, H>(ob: Either<A, C>, oc: Either<A, D>, od: Either<A, E>, oe: Either<A, F>, of: Either<A, G>, f: (a: B, b: C, c: D, d: E, e: F, f: G) => H): Either<A, H>;
}

/**
 * The right side of the disjoint union, as opposed to the Left side.
 * @param b
 * @constructor
 */
export function Right<A, B>(b: B): Either<A, B> {
    return new RightImpl<A, B>(b);
}

/**
 * The left side of the disjoint union, as opposed to the Right side.
 * @param a
 * @constructor
 */
export function Left<A, B>(a: A): Either<A, B> {
    return new LeftImpl<A, B>(a);
}

export function Either<A, B>(cond: boolean, left: () => A, right: () => B): Either<A, B> {
    return !cond ? Left<A, B>(left()) : Right<A, B>(right());
}

/**
 * Either implementation.
 */
abstract class EitherImpl<A, B> implements Either<A, B> {
    value: A | B;
    isLeft: boolean;
    isRight: boolean;

    toString(): string {
        return this.isLeft ? `Left(${this.value})` : `Right(${this.value})`;
    }

    /** @override */
    left(): LeftProjection<A, B> {
        return new LeftProjection(this);
    }

    /** @override */
    right(): RightProjection<A, B> {
        return new RightProjection(this);
    }

    /** @override */
    fold<X>(fa: (a: A) => X, fb: (b: B) => X): X {
        return this.isLeft ? fa(<A>this.value) : fb(<B>this.value);
    }

    /** @override */
    swap(): Either<B, A> {
        return this.isLeft ? Right<B, A>(<A>this.value) : Left<B, A>(<B>this.value);
    }

    /** @override */
    foreach(f: (b: B)=>void): void {
        if (this.isRight) {
            f(<B>this.value);
        }
    }

    /** @override */
    getOrElse(dv: () => B): B {
        return this.isLeft ? dv() : <B>this.value;
    }

    /** @override */
    contains(elem: B): boolean {
        return this.isRight && <B>this.value === elem;
    }

    /** @override */
    forall(f: (v: B)=>boolean): boolean {
        return this.isLeft || f(<B>this.value);
    }

    /** @override */
    exists(f: (v: B)=>boolean): boolean {
        return this.isRight && f(<B>this.value);
    }

    /** @override */
    map<Y>(f: (v: B)=>Y): Either<A, Y> {
        return this.isLeft ? Left<A, Y>(<A>this.value) : Right<A, Y>(f(<B>this.value));
    }

    /** @override */
    flatMap<Y>(f: (v: B)=>Either<A, Y>): Either<A, Y> {
        return this.isLeft ? Left<A, Y>(<A>this.value) : f(<B>this.value);
    }

    /** @override */
    toOptional(): Optional<B> {
        return this.isLeft ? None : Some(<B>this.value);
    }

    /** @override */
    match<C>(pf: {Left: ((v: A)=>C); Right: ((v: B)=>C)}): C {
        return this.fold(pf.Left, pf.Right);
    }

    chain<C>(ob: Either<any, C>): EitherBuilder1<B, C> {
        return new EitherBuilder1(this, ob);
    }

    apply1<C, D>(ob: Either<A, C>, f: (a: B, b: C)=>D): Either<A, D> {
        return this.flatMap(a => ob.map(b => f(a, b)));
    }

    apply2<C, D, E>(ob: Either<A, C>, oc: Either<A, D>, f: (a: B, b: C, c: D)=>E): Either<A, E> {
        return this.flatMap(a => ob.flatMap(b => oc.map(c => f(a, b, c))));
    }

    apply3<C, D, E, F>(ob: Either<A, C>, oc: Either<A, D>, od: Either<A, E>, f: (a: B, b: C, c: D, d: E)=>F): Either<A, F> {
        return this.flatMap(a => ob.flatMap(b => oc.flatMap(c => od.map(d => f(a, b, c, d)))));
    }

    apply4<C, D, E, F, G>(ob: Either<A, C>, oc: Either<A, D>, od: Either<A, E>, oe: Either<A, F>, f: (a: B, b: C, c: D, d: E, e: F)=>G): Either<A, G> {
        return this.flatMap(a => ob.flatMap(b => oc.flatMap(c => od.flatMap(d => oe.map(e => f(a, b, c, d, e))))));
    }

    apply5<C, D, E, F, G, H>(ob: Either<A, C>, oc: Either<A, D>, od: Either<A, E>, oe: Either<A, F>, of: Either<A, G>, f: (a: B, b: C, c: D, d: E, e: F, f: G)=>H): Either<A, H> {
        return this.flatMap(a => ob.flatMap(b => oc.flatMap(c => od.flatMap(d => oe.flatMap(e => of.map(ff =>f(a, b, c, d, e, ff)))))));
    }
}

//------------------------------------
//
// Implementation section.
//
//------------------------------------

/**
 * Left implementation.
 */
class LeftImpl<A, B> extends EitherImpl<A, B> implements Either<A, B> {
    isLeft: boolean = true;
    isRight: boolean = false;

    constructor(public value: A) {
        super();
    }
}

/**
 * Right implementation
 */
class RightImpl<A, B> extends EitherImpl<A, B> implements Either<A, B> {
    isLeft: boolean = false;
    isRight: boolean = true;

    constructor(public value: B) {
        super();
    }
}

/**
 * Left project.
 */
export class LeftProjection<A, B> {
    constructor(private self: Either<A, B>) {
    }

    toString(): string {
        return `LeftProjection(${this.self.toString()})`;
    }

    get(): A {
        if (this.self.isLeft) {
            return <A>this.self.value;
        } else {
            throw new Error('cannot get Left value');
        }
    }

    foreach(f: (a: A) => void): void {
        if (this.self.isLeft) {
            f(<A>this.self.value);
        }
    }

    getOrElse<X extends A>(x: () => X): A {
        return this.self.isLeft ? <A>this.self.value : x();
    }

    forall(f: (a: A) => boolean): boolean {
        return this.self.isLeft ? f(<A>this.self.value) : true;
    }

    exists(f: (a: A) => boolean): boolean {
        return this.self.isLeft ? f(<A>this.self.value) : false;
    }

    filter(f: (a: A) => boolean): Optional<Either<A, B>> {
        if (this.self.isLeft) {
            return f(<A>this.self.value) ? Optional.apply(this.self) : None;
        } else {
            return None;
        }
    }

    map<X>(f: (a: A) => X): Either<X | A, B> {
        return this.self.isLeft ? Left<X, B>(f(<A>this.self.value)) : this.self;
    }

    flatMap<X>(f: (a: A) => Either<X, B>): Either<X | A, B> {
        return this.self.isLeft ? f(<A>this.self.value) : this.self;
    }

    toOptional(): Optional<A> {
        return this.self.isLeft ? Optional.apply(<A>this.self.value) : None;
    }
}

/**
 * Left project.
 */
export class RightProjection<A, B> {
    constructor(private self: Either<A, B>) {
    }

    toString(): string {
        return `RightProjection(${this.self.toString()})`;
    }

    get(): B {
        if (this.self.isRight) {
            return <B>this.self.value;
        } else {
            throw new Error('cannot get Right value');
        }
    }

    foreach(f: (b: B) => void): void {
        if (this.self.isRight) {
            f(<B>this.self.value);
        }
    }

    getOrElse<X extends B>(x: () => X): B {
        return this.self.isRight ? <B>this.self.value : x();
    }

    forall(f: (b: B) => boolean): boolean {
        return this.self.isRight ? f(<B>this.self.value) : true;
    }

    exists(f: (b: B) => boolean): boolean {
        return this.self.isRight ? f(<B>this.self.value) : false;
    }

    filter(f: (b: B) => boolean): Optional<Either<A, B>> {
        if (this.self.isRight) {
            return f(<B>this.self.value) ? Optional.apply(this.self) : None;
        } else {
            return None;
        }
    }

    map<X>(f: (b: B) => X): Either<A, X | B> {
        return this.self.isLeft ? this.self : Right<A, X>(f(<B>this.self.value));
    }

    flatMap<X>(f: (a: B) => Either<A, X>): Either<A, X | B> {
        return this.self.isLeft ? this.self : f(<B>this.self.value);
    }

    toOptional(): Optional<B> {
        return this.self.isRight ? Optional.apply(<B>this.self.value) : None;
    }
}

export class EitherBuilder1<A, B> {
    constructor(private oa: Either<any, A>,
                private ob: Either<any, B>) {
    }

    run<C>(f: (a: A, b: B) => C): Either<any, C> {
        return this.oa.apply1(this.ob, f);
    }

    chain<C>(oc: Either<any, C>): EitherBuilder2<A, B, C> {
        return new EitherBuilder2(this.oa, this.ob, oc);
    }
}


export class EitherBuilder2<A, B, C> {
    constructor(private oa: Either<any, A>,
                private ob: Either<any, B>,
                private oc: Either<any, C>) {
    }

    run<D>(f: (a: A, b: B, c: C) => D): Either<any, D> {
        return this.oa.apply2(this.ob, this.oc, f);
    }

    chain<D>(od: Either<any, D>): EitherBuilder3<A, B, C, D> {
        return new EitherBuilder3(this.oa, this.ob, this.oc, od);
    }
}

export class EitherBuilder3<A, B, C, D> {
    constructor(private oa: Either<any, A>,
                private ob: Either<any, B>,
                private oc: Either<any, C>,
                private od: Either<any, D>) {
    }

    run<E>(f: (a: A, b: B, c: C, d: D) => E): Either<any, E> {
        return this.oa.apply3(this.ob, this.oc, this.od, f);
    }

    chain<E>(oe: Either<any, E>): EitherBuilder4<A, B, C, D, E> {
        return new EitherBuilder4(this.oa, this.ob, this.oc, this.od, oe);
    }
}

export class EitherBuilder4<A, B, C, D, E> {
    constructor(private oa: Either<any, A>,
                private ob: Either<any, B>,
                private oc: Either<any, C>,
                private od: Either<any, D>,
                private oe: Either<any, E>) {
    }

    run<F>(f: (a: A, b: B, c: C, d: D, e: E) => F): Either<any, F> {
        return this.oa.apply4(this.ob, this.oc, this.od, this.oe, f);
    }

    chain<F>(of: Either<any, F>): EitherBuilder5<A, B, C, D, E, F> {
        return new EitherBuilder5(this.oa, this.ob, this.oc, this.od, this.oe, of);
    }
}

export class EitherBuilder5<A, B, C, D, E, F> {
    constructor(private oa: Either<any, A>,
                private ob: Either<any, B>,
                private oc: Either<any, C>,
                private od: Either<any, D>,
                private oe: Either<any, E>,
                private of: Either<any, F>) {
    }

    run<G>(f: (a: A, b: B, c: C, d: D, e: E, f: F) => G): Either<any, G> {
        return this.oa.apply5(this.ob, this.oc, this.od, this.oe, this.of, f);
    }
}