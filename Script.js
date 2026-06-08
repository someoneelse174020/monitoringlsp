const CH1 = {
    id: "3403067",
    key: "91HT99SJN6YRO2MQ"
  };
  
  const CH2 = {
    id: "3403075",
    key: "FHYPUK98LNIW8E94"
  };
  
  
  // ================= SUHU CHART =================
  const tempCtx = document.getElementById("tempChart");
  
  const tempChart = new Chart(tempCtx,{
  type:'line',
  data:{
  labels:[],
  datasets:[{
  label:'Suhu (°C)',
  data:[],
  borderColor:'#ef4444',
  tension:0.4
  }]
  },
  options:{
  scales:{
  x:{ticks:{color:'white'}},
  y:{ticks:{color:'white'}}
  },
  plugins:{
  legend:{labels:{color:'white'}}
  }
  }
  });
  
  
  // ================= KELEMBAPAN CHART =================
  const humCtx = document.getElementById("humChart");
  
  const humChart = new Chart(humCtx,{
  type:'line',
  data:{
  labels:[],
  datasets:[{
  label:'Kelembapan (%)',
  data:[],
  borderColor:'#3b82f6',
  tension:0.4
  }]
  },
  options:{
  scales:{
  x:{ticks:{color:'white'}},
  y:{ticks:{color:'white'}}
  },
  plugins:{
  legend:{labels:{color:'white'}}
  }
  }
  });
  
  
  // ================= LOAD DATA =================
  async function loadData(){
  
  try{
  
  // ===== CHANNEL 1 (SUHU) =====
  const r1 = await fetch(
  `https://api.thingspeak.com/channels/${CH1.id}/feeds.json?api_key=${CH1.key}&results=20`
  );
  
  const d1 = await r1.json();
  
  tempChart.data.labels = [];
  tempChart.data.datasets[0].data = [];
  
  d1.feeds.forEach(f=>{
  
  const t = new Date(f.created_at).toLocaleTimeString();
  const temp = parseFloat(f.field1);
  
  tempChart.data.labels.push(t);
  tempChart.data.datasets[0].data.push(temp);
  
  });
  
  
  // ===== CHANNEL 2 (KELEMBAPAN) =====
  const r2 = await fetch(
  `https://api.thingspeak.com/channels/${CH2.id}/feeds.json?api_key=${CH2.key}&results=20`
  );
  
  const d2 = await r2.json();
  
  humChart.data.labels = [];
  humChart.data.datasets[0].data = [];
  
  d2.feeds.forEach(f=>{
  
  const t = new Date(f.created_at).toLocaleTimeString();
  const hum = parseFloat(f.field2);
  
  humChart.data.labels.push(t);
  humChart.data.datasets[0].data.push(hum);
  
  });
  
  tempChart.update();
  humChart.update();
  
  }catch(err){
  console.log(err);
  }
  
  }
  
  
  // ================= RELAY =================
  function toggleRelay(num){
  
  const btn = document.getElementById("relay"+num);
  
  btn.classList.toggle("active");
  
  const status = btn.classList.contains("active") ? 1 : 0;
  
  // kirim ke ThingSpeak (relay field 1 & 2)
  fetch(
  `https://api.thingspeak.com/update?api_key=9KTMIHN5TJN6UJ66&field${num}=${status}`
  );
  
  console.log("Relay",num,status);
  
  }
  
  
  // ================= AUTO REFRESH =================
  loadData();
  setInterval(loadData,15000);