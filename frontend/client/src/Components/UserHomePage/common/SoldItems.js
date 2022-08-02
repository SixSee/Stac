import React, {useEffect, useState} from 'react';
import Grid from "@mui/material/Grid";
import ItemCard from "./ItemCard";
import SoldItemCard from "./SoldItemCard";

const SoldItems = () => {
    const [items, setItems] = useState(undefined);

    async function getItems() {
        return await fetch(`${process.env.REACT_APP_BASE_URL}/order/seller`, {
            'method': "GET",
            headers: {
                "x-access-token": localStorage.getItem("authtoken"),
            }
        }).then(res => res.json())
    }
    async function fetchItems() {
        setItems(await getItems());
    }
    useEffect(() => {
        fetchItems();
    }, [])

    console.log(items)


    return (
        <div id="market-div">

            <h1>Your listed items</h1>
            {items !== undefined ?
                <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>{
                    items.map((item, index) => {
                        return (
                            <Grid item xs={2} sm={3} md={3} lg={3} key={index}>
                                <SoldItemCard item={item} sellerItem={true} />
                            </Grid>
                        )
                    })}
                </Grid> : <>Loading</>}
        </div>
    );
};

export default SoldItems;