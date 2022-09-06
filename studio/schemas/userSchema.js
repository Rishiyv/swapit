export const userSchema = {
    name: 'users',
    title: 'User',
    type: 'document',
    fields: [
        {
            name: 'address',
            title: 'Wallet address',
            type: 'string'
        },
        {
            name: 'userName',
            title: 'Username',
            type: 'string'
        },
        {
            name: 'transactions',
            title: 'Transactions',
            type: 'array',
            of: [
                {
                    type: 'reference',
                    to: [{type: 'transactions'}],
                }
            ]
        }
    ]
}
