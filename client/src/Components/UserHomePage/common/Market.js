import { getListItemSecondaryActionClassesUtilityClass } from '@mui/material';
import React, { useEffect, useState } from 'react'
import ItemCard from './ItemCard';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
export default function Market() {
    const [items, setItems] = useState(undefined);
    async function getItems() {
        return await fetch(`${process.env.REACT_APP_BASE_URL}/item`, {
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
    console.log(items);
    return (
        <div>
            <h1>All items</h1>
            {items !== undefined ?
                <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 4, sm: 8, md: 12 }}>{
                    items.map((item, index) => {
                        return (
                            <Grid item xs={2} sm={3} md={3} lg={3} key={index}>
                                <ItemCard item={item} />
                            </Grid>
                        )
                    })}
                </Grid> : <>Loading</>}
        </div>
    );
}