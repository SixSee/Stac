import React from 'react';
import { Button, TextField } from '@mui/material';
export default function AddItemForm() {
    async function addItem({ name, description, price, quantity }) {
        const authtoken = localStorage.getItem("authtoken");
        const imageInput = document.getElementById('item-image');
        const form = new FormData();
        form.append("name", name);
        form.append("description", description);
        form.append("price", price);
        form.append("quantity", quantity);
        form.append("image", imageInput.files[0]);
        return await fetch(`${process.env.REACT_APP_BASE_URL}/item/`, {
            method: "POST",
            headers: {
                "x-access-token": authtoken
            },
            body: form
        }).then(() => { window.location.pathname = '/homepage' })
    }
    function createItem() {
        var name = document.getElementById('item-name').value;
        var price = parseInt(document.getElementById('item-price').value);
        var quantity = parseInt(document.getElementById('item-quantity').value);
        var description = document.getElementById('item-description').value;
        addItem({ name, description, price, quantity });
    }
    return (
        <div id="add-form">
            <h1>Add New Item</h1>
            <TextField style={{ width: "500px" }} id="item-name" required label="Name" variant="outlined" type="text" className="productName" /><br /><br />
            <TextField style={{ width: "500px" }} id="item-description" required label="Description" variant="outlined" type="text" className="productDescription" /><br /><br />
            <TextField style={{ width: "500px" }} id="item-price" required label="Price" variant="outlined" type="number" className="productPrice" /><br /><br />
            <TextField style={{ width: "500px" }} id="item-quantity" required label="Quantity" variant="outlined" type="number" className="productQuantity" /><br /><br />
            <TextField style={{ width: "500px" }} id="item-image" required variant="outlined" type="file" className="productImage" /><br /><br />
            <Button variant="contained" onClick={createItem} style={{ backgroundColor: "green" }} size="large" >Add Item</Button>
        </div>
    );
}