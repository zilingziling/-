import React, { Component, useEffect, useState } from "react";
import Search from "./components/search";
import Content from "./components/table";
import "./opeLog.less";
const OpeLog = () => {
  const [username, setName] = useState("");
  const [begintime, setB] = useState("");
  const [selsign, setSign] = useState("");
  const [endtime, setE] = useState("");
  const [clickS, setClick] = useState(true);
  const [pageNo, setCurrent] = useState(1);

  const searchProps = {
    setName,
    setB,
    setSign,
    setE,
    setClick,
    clickS,
    setCurrent
  };
  const search = {
    username,
    begintime,
    selsign,
    endtime,
    clickS
  };
  const tableP = {
    pageNo,
    setCurrent
  };
  return (
    <div className="wrapper">
      <Search {...searchProps} />
      <Content search={search} {...tableP} />
    </div>
  );
};

export default OpeLog;
