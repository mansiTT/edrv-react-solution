import React, { useEffect, useState } from "react";
import { Button, Descriptions, Row, Col, Statistic } from "antd";
import "antd/dist/antd.css";
import EdrvDataService from '../../services/EDRVDataService'
import useInterval from "../../common/useInterval";
import LogoutButton from "../auth/LogoutButton"

const Home = () => {
const CSID = "k55i"
const [started, setStarted] = useState(false)
const [connectorStatus, setConnectorStatus] = useState("")
const [transactionId, setTransactionId] = useState("")
const [transactionDtls, setTransactionDtls] = useState({})

// TODO remove hardcoded values 
const CHARGESTATION="612e38fd8816cc7af6decbce"
const CONNECTOR= "612e38fe8816cc7af6decbdd"
const USER="612e31e3500ccb7a366d4ad1"
const TOKEN="6133418352e02e2503fbae3f"


useEffect(() => {
    fetchConnectorStatus()
}, [])

useInterval(() => {
    if(started && transactionId.length > 0) {
     transactionInfo(transactionId)
    }
   }, 20000);

const fetchConnectorStatus = async () => {
  const response = await EdrvDataService.getConnectorStatus('612e38fe8816cc7af6decbdd')
  console.log(response)
  if(response.data.result && response.data.ok) {
    setConnectorStatus(response.data.result.status)
  }
 
}

const handleStart = async () => {
    const data = {
        chargestation: CHARGESTATION,
        connector: CONNECTOR,
        user: USER,
        token: TOKEN
      }
    const response = await EdrvDataService.remoteStart(data);
    if(response.data.result && response.data.ok) {
        setStarted(true)   
        setTransactionId(response.data.result.command.transaction)
    }
    
}

const handleStop = async (id) => {
    const data = {
        chargestation: CHARGESTATION,
        user: USER,
        transaction: transactionId
      }
    const response = await EdrvDataService.remoteStop(data);
    if(response) {
        setStarted(false)
        transactionInfo(transactionId)
    } 
}

const transactionInfo = async (transactionId) => {
    const { data } = await EdrvDataService.getMeterReading(transactionId);
    const costResult = await EdrvDataService.getTransationCost(transactionId);
    let tempTransactionDtls = {}
    tempTransactionDtls.amount = costResult.data.result.amount
    tempTransactionDtls.currency = costResult.data.result.currency
    if(data.result.metrics) {
       if(data.result.metrics.timeSpentCharging)  tempTransactionDtls.time = data.result.metrics.timeSpentCharging
       if(data.result.metrics.wattHoursConsumed) tempTransactionDtls.energy = data.result.metrics.wattHoursConsumed / 1000
    }
    setTransactionDtls(tempTransactionDtls)
}

return (
<div style={{ textAlign: "center" }}>
<div style={{ textAlign: "right" }}> <LogoutButton/> </div>

<Descriptions title="eDRV's Driver App" bordered>
<Descriptions.Item bordered>
<Row gutter={16}>
    <Col span={12}>
      <Statistic title="CSID" value={CSID} />
    </Col>
    <Col span={12}>
      <Statistic title="Connector Stauts" value={connectorStatus}>
      </Statistic>    
     
    </Col>
  </Row>
  </Descriptions.Item>  
  <br/>   
  <Descriptions.Item bordered>  <Statistic title="Charging" value="-"></Statistic>  
  {
     (started || connectorStatus === 'Charging') ? <Button
     style={{ marginTop: 16 }} type="primary" onClick={() => handleStop()}>Stop</Button> :
     <Button style={{ marginTop: 16 }} type="primary" onClick={() => handleStart()} >Start</Button>
 } 
    </Descriptions.Item>
  </Descriptions>
  <Descriptions
      title="Transaction Readings"
      bordered>
      <Descriptions.Item label="Engery(kWh)">{transactionDtls.energy}</Descriptions.Item>
      <Descriptions.Item label="Time">{transactionDtls.time}</Descriptions.Item>
      <Descriptions.Item label="Cost">{transactionDtls.amount} {transactionDtls.currency}</Descriptions.Item>
  </Descriptions>
</div>
)
}


export default Home
