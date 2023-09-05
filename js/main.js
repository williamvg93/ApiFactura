const urlUser = 'https://64f202d40e1e60602d2490d4.mockapi.io/usuario'
const urlInvoice = 'https://64f2062f0e1e60602d249a99.mockapi.io/invoice'
const urlProduct = 'https://64f202d20e1e60602d2490bc.mockapi.io/producto'


/* Function to get all data */
const getAllData = async (url) => {
    let reqData = await fetch(url)
    let respJson = await reqData.json()
    return respJson
}

/* Function to get a specific data */
const getInvoice = async (idInv) => {
    let reqData = await fetch(`https://64f2062f0e1e60602d249a99.mockapi.io/invoice/${idInv}`)
    let respJson = await reqData.json()
    console.log(respJson)
}

/* Function to get a specific data */
const getDataById = async (dataUrl, dataId, para) => {
    const url = new URL(dataUrl);
    url.searchParams.append(para, dataId);

    let reqData = await fetch(url, {
        method: 'GET',
        headers: {'content-type':'application/json'},
    })
    let respJson = await reqData.json()
    return respJson
}

/* Function to add data */
const addInvoice = async (newInvoice) => {
    let confApi = {
        method : "POST",
        headers : {'content-Type' : 'application/json'},
        body : JSON.stringify(newInvoice)
    }

    let peticion = await fetch("https://64f2062f0e1e60602d249a99.mockapi.io/invoice", confApi)
    let respJson = await peticion.json()
    console.log(respJson)
}

/* Funcion to update data */
const updaInvoice = async (idInv) => {
    let newInvoice = {
        invoCod: 900009,
        invoTotPri: 55000,
        userCode: 1000001,
        prodList: [
            {
                proId : 100011,
                proUnid : 2
            },
            {
                proId : 100022,
                proUnid : 3
            }
        ]
    }
    let confApi = {
        method : "PUT",
        headers : {'content-Type' : 'application/json'},
        body : JSON.stringify(newInvoice)
    }

    let peticion = await fetch(`https://64f2062f0e1e60602d249a99.mockapi.io/invoice/${idInv}`, confApi)
    let respJson = await peticion.json()
    console.log(respJson)
}

/* Function to delete data */
const DelInvoice = async (idInv) => {
    let reqData = await fetch(`https://64f2062f0e1e60602d249a99.mockapi.io/invoice/${idInv}`, { method: 'DELETE'})
    let respJson = await reqData.json()
    console.log(respJson)
}

/* getAllData(urlUser)
getAllData(urlProduct)
getAllData(urlInvoice) */
/* getDataById(urlInvoice,'1', 'invoId') */
/* getUser('1') */
/* 
getInvoice('2')
addInvoice()
DelInvoice("1")
updaInvoice("4")*/

let addInvo = document.querySelector('#AddInvo')
let addPro = document.querySelector('#AddProd')
const expUser = /^[0-9]{1,16}$/
let proList = []
let valTotal = 0
let listVoi = document.querySelector('#listVoiPage')



addPro.onclick = () => {
    let proCod = document.querySelector('#proCod')
    let valProCod = proCod.value.trim()
    let proUnit = document.querySelector('#proUnit')
    let valproUnit = proUnit.value.trim()
    if (!expUser.test(valProCod)) {
        alert('The Product must have at least 4 characters and only numbers are allowed')
        return
    } else {
        getDataById(urlProduct, valProCod, 'id').then(prodData => {
            if (prodData.length < 1) {
                alert('The Product does not exist in the database')
                proCod.value = ''
                proUnit.value = ''
                return
            } else {
                if (!expUser.test(valproUnit)) {
                    alert('The Units must have at least 1 characters and only numbers are allowed')
                    proUnit.value = ''
                    return
                } else if (valproUnit == 0) {
                    alert('the number must be greater than 0')
                    proUnit.value = ''
                    return
                } else {
                    let newPro = {
                        codigo: prodData[0].codigo,
                        nombre: prodData[0].nombre,
                        cantidad : valproUnit,
                        precio : prodData[0].precio
                    }
                    proList.push(newPro)
                    console.log(proList);
                    let tablaPro = document.querySelector('#tablaPro')
                    tablaPro.insertAdjacentHTML('beforeEnd', /* html */`
                                <tr>
                                    <td>${prodData[0].nombre}</td>
                                    <td>${prodData[0].precio}</td>
                                    <td>${valproUnit}</td>
                                    <td>${parseInt(valproUnit) * parseInt(prodData[0].precio)}</td>                       
                                </tr>
                    `)
                    proCod.value = ''
                    proUnit.value = ''
                    valTotal += parseInt(valproUnit) * parseInt(prodData[0].precio)
                    document.querySelector('#Total').innerHTML = ''
                    document.querySelector('#Total').insertAdjacentText('beforeEnd', `Total: ${valTotal}`)  
                }
            }
        }).catch( e => {
            console.log(e);
        }) 
    } 
}


addInvo.onclick = () => {
    
    let userId = document.querySelector('#userId').value.trim()
    let proCod = document.querySelector('#proCod').value.trim()
    
    console.log(expUser.test(userId));
    console.log(userId);
    console.log(proCod);

    if (!expUser.test(userId)) {
        alert('The User must have at least 4 characters and only numbers are allowed')
        return
    } else {
        getDataById(urlUser, userId, 'id').then(userData => {
            console.log(userData);
            console.log(userData.length);
            if (userData.length < 1) {
                alert('The user does not exist in the database')
                return
            } else if (proList.length < 1) {
                alert('no products have been added to the invoice')
                return
            } else {
                const infoDate = new Date();
                const nowDate = infoDate.toLocaleString();
                const newInvoice = {
                    invoTotPri: valTotal,
                    invoDate: nowDate,
                    userCode: userId,
                    prodList: proList,
                }
                addInvoice(newInvoice).then(invoice => {
                    proList = []
                })
            }
        }).catch(e => {
            console.log(e);
        }) 
    }

    document.querySelector('#Total').innerHTML = ''
    document.querySelector('#Total').innerHTML = '' 
    document.querySelector('#tablaPro').innerHTML = ''
    document.querySelector('#userId').innerHTML = ''

}


listVoi.onclick = () => {
    let mainCont = document.querySelector('#main-cont')
    mainCont.innerHTML = ''
    mainCont.setAttribute('style', 'justify-content:center;align-items:center;overflow: scroll; padding: 10px; height:auto')
    mainCont.insertAdjacentHTML('beforeend', /* html */`
                <table class="main-table" id="mainTable">
                <tr class="tags">
                    <th>ID invoice</th>
                    <th>User's Name</th>
                    <th>Purchase Date</th>
                    <th>Products</th>
                    <th>Amount</th>
                    <th>Actions</th>
                </tr>
                </table>
    `)
    
    let allInvo = getAllData(urlInvoice).then(dataInvo => {
        console.log(dataInvo);
        dataInvo.forEach(element => {
            console.log(element.userCode);
            let allusers = getDataById(urlUser,element.userCode,'id').then(dataUser => {
                console.log(dataUser[0].nombre);
                document.querySelector('#mainTable').insertAdjacentHTML('beforeend', /* html */`
                
                    <tr class="purchase-info">
                        <th>${element.invoId}</th>
                        <th>${dataUser[0].nombre}</th>
                        <th>${element.invoDate}</th>
                        <th><select name="products" id="name-products">
                            <option value="opcion1">Potaito</option>
                            <option value="opcion2">Toilet paper</option>
                            <option value="opcion3">Beans</option>
                            <option value="opcion4">Tuna</option>
                            <option value="opcion5">Sandals</option>
                        </select></th>
                        <th>${element.invoTotPri}</th>
                        <th>
                            <button class="delete-buttom"><img src="img/delete.svg" alt="delete"></button>
                            <button class="add-buttom"><img src="img/add.svg" alt="add"></button>
                        </th>
                    </tr>
            
                `)
            }).catch(e => {
                console.log(`Error: ${e}`);
            })
        });
    }).catch(e => {
        console.log(`Error: ${e}`);
    })



}