export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string,
    String: string,
    Boolean: boolean,
    Int: number,
    Float: number,
};

// export type Query = {
//     __typename?: 'Query',
//     user?: Maybe<Scalars['String']>,
// };
//
//
// export type QueryUserArgs = {
//     id: Scalars['Int']
// };

export type User = {
    __typename?: 'User',
    id: Scalars['Int'],
    name?: Maybe<Scalars['String']>,
};
