const { UserInputError } = require('apollo-server-express');
const { GraphQLScalarType, Kind } = require('graphql');
const email = new GraphQLScalarType ( {
    name: 'Email',
    description: "Email Custom Scalar Type for Users",

    serialize(value) {
        return value;;
    },

    parseValue(value) {
        return value;
    },

    parseLiteral(ast) {
        if (ast.kind === Kind.STRING && /\w+@\w+.\w+/.match(value))
            return ast.value;
        throw new UserInputError("Provided Value is not an Email.")
    }

});
module.exports = email;