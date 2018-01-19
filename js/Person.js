/**
 * Base Person
 */

class Person {

    constructor() {
        this.add = document.getElementById('addUser');
        this.roleInput = document.getElementById('userRole');
        this.nameInput = document.getElementById('userName');
        this.mailInput = document.getElementById('userEmail');
        this.errorBlock = document.getElementById('error-block');
        this.counter = 0;
        this.localStorageArr = JSON.parse(localStorage.getItem('users')) || {};
    }

    init() {
        let that = this;
        this.checkingUsers();
        this.validate(that);
    }

    checkingUsers() {

        for (let key in this.localStorageArr) {
            this.counter = key;
            this.addUserHtml(this.localStorageArr[key].userName, this.localStorageArr[key].userEmail, this.localStorageArr[key].userRole, key);
        }
    }

    validate(that) {
        that.add.addEventListener('click', function (e) {
            e.preventDefault();
            let regex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

            if(!that.nameInput.value.trim()) {
                that.showError('Please enter your name', that.nameInput);

            } else if (!that.mailInput.value.trim()) {
                that.showError('Please enter your email address', that.mailInput);

            } else if ( !regex.test(that.mailInput.value) ) {
                that.showError('The specified email address is not valid.',that.mailInput);

            } else {
                that.getValue();
                that.nameInput.value = '';
                that.mailInput.value = '';
                that.roleInput.value = 'guest';
            }

        });
    }

    showError(errorText, input) {
        this.errorBlock.innerHTML = errorText;
        this.errorBlock.classList.remove('invisible');
        input.closest('.form-group').classList.add('has-error');

        setTimeout(function() {
            this.errorBlock.innerHTML = '';
            this.errorBlock.classList.add('invisible');
        }.bind(this), 3000);

        input.addEventListener('focus', function() {
            input.closest('.form-group').classList.remove('has-error');
        });
    }

    getValue() {
        let name = this.nameInput.value;
        let mail = this.mailInput.value;
        let role = this.roleInput.value;

        this.userRole(name, mail, role);
        this.savingData(name, mail, role);
    }

    savingData(name, mail, role) {
        let id = ++this.counter;

        this.localStorageArr[id] = {
            userName: name,
            userEmail: mail,
            userRole: role
        };

        localStorage.setItem('users', JSON.stringify(this.localStorageArr));
    }

    userRole(name, mail, role) {

        if(role == 'admin') {
            let user = new Admin(name, mail, this.counter);
            user.init();
        }
        if(role == 'guest') {
            let user = new Guest(name, mail, this.counter);
            user.init();
        }
        if(role == 'user') {
            let user = new User(name, mail, this.counter);
            user.init();
        }
    }

    addUserHtml(name, mail, role, counter) {
        let users = document.getElementById('users-list-block');

        users.insertAdjacentHTML('beforeend', `
            <tr id="${counter}">
                <td class="userName"><input type="text" value="${name}" readonly></td> 
                <td class="userEmail"><input type="text" value="${mail}" readonly></td> 
                <td class="userRole">
                    <input type="text" value="${role}" readonly>
                    <span class="deleteItem">delete</span>
                </td>
            <tr/>`);

        this.listenUserEl();
        this.deleteUser();
    }

    listenUserEl() {
        let td = document.querySelectorAll('#users-list-block td');

        td.forEach((iTd) => this.editListField(iTd));
    }

    editListField(field) {
        field.addEventListener('dblclick', function(e) {
            let input = e.target;
            let trClass = input.closest('td').getAttribute('class');
            if(trClass === 'userName' || 'userEmail') {
                this.letEdit(e);
            }

            if (trClass === 'userRole') {
                let select = document.createElement('select');
                let options = ['guest', 'user', 'admin'];

                for (let i = 0; i < options.length; i++) {
                    let option = document.createElement('option');
                    option.value = options[i];
                    option.text = options[i];
                    select.appendChild(option);
                }

                select.value = input.value;
                e.target.closest('td').replaceChild(select, e.target);
                this.stopEdit(select);
            }
        }.bind(this));
    }

    letEdit(e) {
        e.target.removeAttribute('readonly');
        e.target.addEventListener('change', this.savingDataAfterEdit);
        this.stopEdit(e.target);
    }

    savingDataAfterEdit (e) {
        let currentId = e.target.closest('tr').getAttribute('id');
        let localStorageArray = JSON.parse(localStorage.getItem('users'));
        let classField = e.target.closest('td').getAttribute('class');


        for (let key in localStorageArray) {
            if (currentId == key) {
                localStorageArray[key][classField] = e.target.value;
                localStorage.setItem('users', JSON.stringify(localStorageArray));
            }
        }
    }

    stopEdit(field) {
        document.addEventListener('click', function(e) {

            if(!(e.target == field)) {
                field.readOnly = true;
                if (!(e.target.nodeName == 'SELECT')) {

                    let newVal = field.value;
                    let currentId = field.closest('tr').getAttribute('id');
                    let localStorageArray = JSON.parse(localStorage.getItem('users'));
                    let classField = field.closest('td').getAttribute('class');
                    let input = document.createElement('input');
                    input.value = newVal;

                    field.closest('td').replaceChild(input, field);
                    input.readOnly = true;

                    for (let key in localStorageArray) {
                        if (currentId == key) {
                            localStorageArray[key][classField] = newVal;
                            localStorage.setItem('users', JSON.stringify(localStorageArray));
                        }
                    }
                }
            }

        });
    }

    deleteUser() {
        let userList = document.getElementsByClassName('users-list');
        let deleteItem = document.querySelectorAll('.deleteItem');

        deleteItem.forEach(function(deleteEl) {
            deleteEl.addEventListener('click', function(e) {

                let currentId = e.target.closest('tr').getAttribute('id');
                let localStorageArr = JSON.parse(localStorage.getItem('users'));

                for (let key in localStorageArr) {
                    if(currentId == key) {
                        delete localStorageArr[key];
                        localStorage.setItem('users', JSON.stringify(localStorageArr));
                    }
                }
                e.target.closest('tr').remove();
            })
        })
    }
}

let base = new Person();
base.init();

