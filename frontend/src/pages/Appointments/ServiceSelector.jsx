import React from 'react'
import {
    TextField,
    MenuItem,
    Checkbox,
    ListItemText
} from '@mui/material'

// prikaz forme za usluge
export default function ServiceSelector({
                                            usluge = [],
                                            uslugaIds = [],
                                            setUslugaIds
                                        }) {
    return (
        <TextField
            select
            label="Usluge"
            value={uslugaIds}
            onChange={e => setUslugaIds(e.target.value)}
            required
            slotProps={{
                select: {
                    multiple: true,
                    renderValue: (selected) =>
                        usluge
                            .filter(u =>
                                selected.includes(u.idUsluga ?? u.id)
                            )
                            .map(u => u.uslugaNaziv)
                            .join(', ')
                }
            }}
            fullWidth
        >
            {/* prikaz usluga */}
            {usluge.map(u => {
                const id = u.idUsluga ?? u.id
                return (
                    <MenuItem key={id} value={id}>
                        <Checkbox checked={uslugaIds.includes(id)} />
                        <ListItemText primary={u.uslugaNaziv} />
                    </MenuItem>
                )
            })}
        </TextField>
    )
}
