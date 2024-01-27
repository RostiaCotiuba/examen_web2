import React from "react";
import Header from "./components/Header";
import AdminTable from "./components/AdminTable";

const Admin = () => {
  return (
    <div>
      <Header />
      <div className="d-flex justify-content-center">
        <div className="row container">
        <div className="col-4">
          <AdminTable dataType="categories" />
          <AdminTable dataType="genres" />
          <div />
        </div>
        <div className="col-8">
          <AdminTable dataType="books" />
          <div />
        </div>
          <div/>
      </div>
    </div>
    </div>
  );
};

export default Admin;
