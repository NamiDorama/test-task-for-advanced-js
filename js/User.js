/**
 * User overrides from Person
 */


class User extends Person {

    constructor(name, mail, counter) {
        super();
        this.name = name;
        this.mail = mail;
        this.role = 'user';
        this.counter = counter;
    }

    init() {
        this.addUserHtml(this.name, this.mail, this.role);
    }

    addUserHtml(name, mail, role) {
        super.addUserHtml(name, mail, role, this.counter);
    };
}
