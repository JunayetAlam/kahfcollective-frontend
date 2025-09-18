import React from 'react';
import A_TopData from '../A_TopData';
import UserTable from './UserTable';

export default function Users() {
    return (
        <div className="w-full h-full space-y-8">

            <A_TopData />
            <UserTable />
        </div>
    );
}