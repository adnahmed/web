const user = {
    username: 'username',
    password: 'password',
    role: 'administrator',
    prefix: ' ',
    givenName: 'givenName',
    middleName: 'middleName',
    lastName: 'lastName',
    email: 'address@domain.com',
    organization: 'organization',
}

const exam = {
    name: "MATH-101",
    start: new Date(2004,3, 30, 3,4,5),
    end: new Date(2004,3, 30, 5,4,5),
    subject: "MATH"
}

module.exports = {
    user,
    exam
}
