import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { LineChart } from "@mui/x-charts/LineChart";
import { RadarChart } from '@mui/x-charts/RadarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import './chart.css'

export default function SimpleLineChart() {
  const [projectsData, setProjectsData] = useState([]);
  const [consultationsData, setConsultationsData] = useState([]);
  const [xLabels, setXLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectsLocData, setProjectsLocData] = useState([]);
  const [projectsStatData, setProjectsStatData] = useState([]);
  const [projectsTypeData, setProjectsTypeData] = useState([]);
  const [seriesData, setSeriesData] = useState([]);
  const [data,setData] = useState([]);

  // ✅ generate months (6 before + current + 6 after)
  const generateMonths = () => {
    const months = [];
    const now = new Date();

    for (let i = -6; i <= 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      months.push(
        d.toLocaleString("default", { month: "short", year: "numeric" })
      );
    }

    return months;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/stat/");

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setData(data)
        setProjectsLocData(data.by_state)
        const pieSeries = data.by_status.map((item, index) => ({
          id: index,
          value: item.count,
          label: item.status.charAt(0).toUpperCase() + item.status.slice(1),
        }));
        setProjectsStatData(pieSeries);




        const types = data.by_type.map(item => item.type);
        const counts = data.by_type.map(item => item.count);

        setProjectsTypeData(types);
        setSeriesData([{ label: "Projects", data: counts }]);





        console.log(data)

        const months = generateMonths();
        setXLabels(months);

        const projectCounts = new Array(months.length).fill(0);
        const consultationCounts = new Array(months.length).fill(0);

        // ✅ projects
        data.projects.forEach((item) => {
          const m = new Date(item.month).toLocaleString("default", {
            month: "short",
            year: "numeric",
          });

          const index = months.indexOf(m);
          if (index !== -1) projectCounts[index] = item.count;
        });

        // ✅ consultations
        data.consultations.forEach((item) => {
          const m = new Date(item.month).toLocaleString("default", {
            month: "short",
            year: "numeric",
          });

          const index = months.indexOf(m);
          if (index !== -1) consultationCounts[index] = item.count;
        });

        setProjectsData(projectCounts);
        setConsultationsData(consultationCounts);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const xLabels_a = projectsLocData.map((item) => item.state);
  const projectCounts = projectsLocData.map((item) => item.count);

  // ✅ Loading state
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  // ✅ Error state
  if (error) {
    return (
      <Typography color="error" align="center" mt={5}>
        {error}
      </Typography>
    );
  }
  console.log(data)

  // ✅ Chart
  return (
    <div className="chart-cnt-page">
      <div className="row allwidth" >
        <div className="column allwidth">
          <div className="row box-cnt" >

            <div className="box">
              <h1>{data.user_count}</h1>
              <h1> User</h1>
            </div>
            <div className="box">
              <h1>{data.project_count}</h1>
              <h1> Project</h1>
            </div>
            <div className="box">
              <h1>{data.consultation_count}</h1>
              <h1> Consultation</h1>
            </div>
          </div>
        <div className="chart-line-cnt">
          <Box
            sx={{
              width: "100%",
              height: 600,
              backgroundColor: "#f0f0f0",
              borderRadius: "12px",
              padding: "16px",
            }}
          >
            <Typography
              variant="h6"
              mb={2}
              sx={{ color: "#2e2f30", fontWeight: 500 }}
            >
              Projects & Consultations Statistics
            </Typography>

            <LineChart
              series={[
                {
                  data: projectsData,
                  label: "Projects",
                  color: "#6366f1",
                  showMark: false, // نحّيو النقاط
                  curve: "monotoneX",

                },
                {
                  data: consultationsData,
                  label: "Consultations",
                  color: "#10b981",
                  showMark: false,
                  curve: "monotoneX",
                  
                },
              ]}
              xAxis={[
                {
                  scaleType: "point",
                  data: xLabels,
                  // tickLabelStyle: {
                  //   fill: "#9ca3af",
                  //   fontSize: 12,
                  // },
                  tickLabelStyle: { display: "none" },
                  tickSize: 0,
                },
              ]}
              yAxis={[
                {
                  // width: 35,
                  // tickLabelStyle: {
                  //   fill: "#9ca3af",
                  //   fontSize: 12,
                  // },
                  tickLabelStyle: { display: "none" },
                  tickSize: 0,
                },
              ]}
              grid={{
                horizontal: true,
                vertical: true,
              }}
              margin={{ top: 10, bottom: 20, left: 0, right: 10 }}
              sx={{
                "& .MuiChartsAxis-line": {
                  display: "none",
                },
                "& .MuiChartsGrid-line": {
                  stroke: "#66686b",
                },
                "& .MuiChartsLegend-root text": {
                  fill: "#d1d5db",
                },
              }}
            />
          </Box>
        </div>
        </div>
        <div className="column" >
          <div className="chart-donat-cnt">
            <Box
              sx={{
                backgroundColor: "#f0f0f0",
                borderRadius: "12px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: "white",

              }}
            >
              <Typography
                variant="h6"
                mb={2}
                sx={{ color: "#3b3b3b", fontWeight: 500 }}
              >
                Projects Distribution
              </Typography>

              <PieChart
                series={[
                  {
                    data: projectsStatData,
                    innerRadius: 60, // donut effect 🔥
                    outerRadius: 100,
                    paddingAngle: 3,
                    cornerRadius: 5,
                    color: "#38393b",
                  },
                ]}
                width={250}
                height={250}
                sx={{
                  "& text": {
                    fill: "#2e2e30",
                    fontSize: 12,
                  },
                }}
              />
            </Box>
          </div>
          <div className="chart-matrix-cnt">
            <Box
              sx={{
                backgroundColor: "#f0f0f0",
                borderRadius: "12px",
                padding: "16px",
              }}
            >
              <Typography
                variant="h6"
                mb={2}
                sx={{ color: "#373738", fontWeight: 500 }}
              >
                Projects Types Overview
              </Typography>

              <RadarChart
                height={300}
                series={[
                  {
                    ...seriesData[0],
                    color: "#6366f1",
                  },
                ]}
                radar={{
                  max: Math.max(...(seriesData[0]?.data || [10])),
                  metrics: projectsTypeData,
                }}
                sx={{
                  "& .MuiChartsLegend-root text": {
                    fill: "#d1d5db",
                  },
                  "& .MuiChartsAxis-tickLabel": {
                    fill: "#9ca3af",
                    fontSize: 12,
                  },
                  "& .MuiChartsGrid-line": {
                    stroke: "#1f2937",
                  },
                }}
              />
            </Box>
          </div>

        </div>
      </div>

      <div className="chart-bar-cnt">
        <Box sx={{ width: "100%", height: 400 }}>
          <BarChart
            series={[
              {
                data: projectCounts,
                color: "#6366f1", // indigo modern
                borderRadius: 8,
              },
            ]}
            xAxis={[
              {
                data: xLabels_a,
                scaleType: "band",
                tickLabelStyle: { display: "none" },
                tickSize: 0,
              },
            ]}
            yAxis={[
              {
                width: 35,
                tickLabelStyle: {
                  fill: "#9ca3af", // gray light
                  fontSize: 12,
                  display: "none",
                  tickSize: 0,
                },
              },
            ]}
            grid={{
              horizontal: true,
              vertical: false,
            }}
            margin={{ top: 10, bottom: 10, left: 0, right: 10 }}
            sx={{
              backgroundColor: "#f0f0f0", // dark card
              borderRadius: "12px",
              padding: "16px",

              "& .MuiChartsAxis-bottom": {
                display: "none",
              },

              "& .MuiChartsAxis-left .MuiChartsAxis-line": {
                display: "none",
              },

              "& .MuiChartsGrid-line": {
                stroke: "#9da1a7", // subtle grid
              },
            }}
          />
        </Box>
      </div>




    </div>

  );
}
