/* tslint:disable:no-use-before-declare */

import 'reflect-metadata';

/**
 * Represents optional values. Instances of `Optional`
 *  are either an instance of $some or the object $none.
 *
 *  The most idiomatic way to use an $optional instance is to treat it
 *  as a collection or monad and use `map`,`flatMap`, `filter`, or
 *  `foreach`:
 */
export abstract class Optional<A> {
    /** Returns true if the option is $none, false otherwise. */
    isEmpty: boolean;
    /** Returns true if the option is an instance of $some, false otherwise. */
    nonEmpty: boolean;

    /**
     * Returns the option's value.
     * @note The option must be nonEmpty.
     */
    abstract get(): A;

    /**
     * Returns the option's value if the option is nonempty, otherwise
     * return the result of evaluating `default`.
     *
     * @param a the default expression.
     */
    getOrElse<B extends A>( a: B ): A {
        return this.isEmpty ? a : this.get();
    }

    /**
     * Returns a $some containing the result of applying $f to this $option's value if this $option is nonempty.
     * Otherwise return $none.
     *
     * @note This is similar to `flatMap` except here, $f does not need to wrap its result in an $option.
     *
     * @param f the function to apply
     * @see flatMap
     * @see foreach
     */
    map<B>( f: ( a: A ) => B ): Optional<B> {
        return this.isEmpty ? None : Some( f( this.get() ) );
    }

    /**
     * Returns the result of applying $f to this $option's
     * value if the $option is nonempty.  Otherwise, evaluates
     * expression `ifEmpty`.
     *
     * @note This is equivalent to `$option map f getOrElse ifEmpty`.
     *
     * @param ifEmpty the expression to evaluate if empty.
     * @param f       the function to apply if nonempty.
     */
    fold<B>( ifEmpty: B, f: ( a: A ) => B ): B {
        return this.isEmpty ? ifEmpty : f( this.get() );
    }

    /**
     * Returns the result of applying $f to this $option's value if this $option is nonempty.
     * Returns $none if this $option is empty.
     * Slightly different from `map` in that $f is expected to return an $option (which could be $none).
     *
     * @param f the function to apply
     * @see map
     * @see foreach
     */
    flatMap<B>( f: ( a: A ) => Optional<B> ): Optional<B> {
        return this.isEmpty ? None : f( this.get() );
    }

    /**
     * Returns this $option if it is nonempty '''and''' applying the predicate $F to
     * this $option's value returns true. Otherwise, return $none.
     *
     * @param p the predicate used for testing.
     */
    filter( f: ( a: A ) => boolean ): Optional<A> {
        return this.isEmpty || f( this.get() ) ? this : None;
    }

    /**
     * Tests whether the option contains a given value as an element.
     *
     * @param elem the element to test.
     * @return `true` if the option has an element that is equal (as determined by `==`) to `elem`, `false` otherwise.
     */
    contains<B extends A>( b: B ): boolean {
        return this.nonEmpty && this.get() === b;
    }

    /**
     * Returns true if this option is nonempty '''and''' the predicate $f returns true when applied to this $option's value.
     * Otherwise, returns false.
     *
     * @param p the predicate to test
     */
    exists( f: ( a: A ) => boolean ): boolean {
        return this.nonEmpty && f( this.get() );
    }

    /**
     * Returns true if this option is empty '''or''' the predicate $f returns true when applied to this $option's value.
     *
     * @param p the predicate to test
     */
    forall( f: ( a: A ) => boolean ): boolean {
        return this.isEmpty || f( this.get() );
    }

    /**
     * Apply the given procedure $f to the option's value, if it is nonempty. Otherwise, do nothing.
     *
     * @param f the procedure to apply.
     * @see map
     * @see flatMap
     */
    foreach( f: ( a: A ) => void ): void {
        if ( this.nonEmpty ) {
            f( this.get() );
        }
    }

    /**
     * Returns this $option if it is nonempty, otherwise return the result of evaluating `alternative`.
     *
     * @param alternative the alternative expression.
     */
    orElse<B extends A>( ob: Optional<B> ): Optional<A> {
        return this.isEmpty ? ob : this;
    }

    // add methods
    apply1<B, C>( ob: Optional<B>, f: ( a: A, b: B ) => C ): Optional<C> {
        return this.flatMap( a => ob.map( b => f( a, b ) ) );
    }

    apply2<B, C, D>( ob: Optional<B>, oc: Optional<C>, f: ( a: A, b: B, c: C ) => D ): Optional<D> {
        return this.flatMap( a => ob.flatMap( b => oc.map( c => f( a, b, c ) ) ) );
    }

    apply3<B, C, D, E>( ob: Optional<B>, oc: Optional<C>, od: Optional<D>, f: ( a: A, b: B, c: C, d: D ) => E ): Optional<E> {
        return this.flatMap( a => ob.flatMap( b => oc.flatMap( c => od.map( d => f( a, b, c, d ) ) ) ) );
    }

    apply4<B, C, D, E, F>( ob: Optional<B>, oc: Optional<C>, od: Optional<D>, oe: Optional<E>, f: ( a: A, b: B, c: C, d: D, e: E ) => F ): Optional<F> {
        return this.flatMap( a => ob.flatMap( b => oc.flatMap( c => od.flatMap( d => oe.map( e => f( a, b, c, d, e ) ) ) ) ) );
    }

    apply5<B, C, D, E, F, G>( ob: Optional<B>, oc: Optional<C>, od: Optional<D>, oe: Optional<E>, of: Optional<F>, f: ( a: A, b: B, c: C, d: D, e: E, f: F ) => G ): Optional<G> {
        return this.flatMap( a => ob.flatMap( b => oc.flatMap( c => od.flatMap( d => oe.flatMap( e => of.map( ff => f( a, b, c, d, e, ff ) ) ) ) ) ) );
    }

    chain<B>( ob: Optional<B> ): OptionalBuilder1<A, B> {
        return new OptionalBuilder1( this, ob );
    }

    static apply<A>( a: A | null | undefined ): Optional<A> {
        return (a !== undefined && a !== null) ? new SomeImpl<A>( a ) : None;
    }
}

/**
 * Class `Some[A]` represents existing values of type `A`.
 */
export function Some<A>( a: A ): Optional<A> {
    return new SomeImpl( a );
}

//------------------------------------
//
// Implementation section.
//
//------------------------------------

class SomeImpl<A> extends Optional<A> {
    isEmpty: boolean = false;
    nonEmpty: boolean = true;

    get(): A {
        return this.value;
    }

    constructor( private value: A ) {
        super();
    }

    toString(): string {
        return 'Some(' + this.value + ')';
    }
}

class NoneImpl extends Optional<any> {
    isEmpty: boolean = true;
    nonEmpty: boolean = false;

    get(): any {
        throw new TypeError( 'None can not #get' );
    }

    toString(): string {
        return 'None';
    }
}

/**
 * This object represents non-existent values.
 */
export const None: Optional<any> = new NoneImpl();

// Builders

export class OptionalBuilder1<A, B> {
    constructor( private oa: Optional<A>,
                 private ob: Optional<B> ) {
    }

    run<C>( f: ( a: A, b: B ) => C ): Optional<C> {
        return this.oa.apply1( this.ob, f );
    }

    chain<C>( oc: Optional<C> ): OptionalBuilder2<A, B, C> {
        return new OptionalBuilder2( this.oa, this.ob, oc );
    }
}

export class OptionalBuilder2<A, B, C> {
    constructor( private oa: Optional<A>,
                 private ob: Optional<B>,
                 private oc: Optional<C> ) {
    }

    run<D>( f: ( a: A, b: B, c: C ) => D ): Optional<D> {
        return this.oa.apply2( this.ob, this.oc, f );
    }

    chain<D>( od: Optional<D> ): OptionalBuilder3<A, B, C, D> {
        return new OptionalBuilder3( this.oa, this.ob, this.oc, od );
    }
}

export class OptionalBuilder3<A, B, C, D> {
    constructor( private oa: Optional<A>, private ob: Optional<B>, private oc: Optional<C>, private od: Optional<D> ) {
    }

    run<E>( f: ( a: A, b: B, c: C, d: D ) => E ): Optional<E> {
        return this.oa.apply3( this.ob, this.oc, this.od, f );
    }

    chain<E>( oe: Optional<E> ): OptionalBuilder4<A, B, C, D, E> {
        return new OptionalBuilder4( this.oa, this.ob, this.oc, this.od, oe );
    }
}

export class OptionalBuilder4<A, B, C, D, E> {
    constructor( private oa: Optional<A>,
                 private ob: Optional<B>,
                 private oc: Optional<C>,
                 private od: Optional<D>,
                 private oe: Optional<E> ) {
    }

    run<F>( f: ( a: A, b: B, c: C, d: D, e: E ) => F ): Optional<F> {
        return this.oa.apply4( this.ob, this.oc, this.od, this.oe, f );
    }

    chain<F>( of: Optional<F> ): OptionalBuilder5<A, B, C, D, E, F> {
        return new OptionalBuilder5( this.oa, this.ob, this.oc, this.od, this.oe, of );
    }
}

export class OptionalBuilder5<A, B, C, D, E, F> {
    constructor( private oa: Optional<A>,
                 private ob: Optional<B>,
                 private oc: Optional<C>,
                 private od: Optional<D>,
                 private oe: Optional<E>,
                 private of: Optional<F> ) {
    }

    run<G>( f: ( a: A, b: B, c: C, d: D, e: E, f: F ) => G ): Optional<G> {
        return this.oa.apply5( this.ob, this.oc, this.od, this.oe, this.of, f );
    }
}