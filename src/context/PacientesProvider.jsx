import { createContext, useState, useEffect } from "react";
import clienteAxios from "../config/axios";

const PacienteContext = createContext();

const PacientesProvider = ({ children }) => {
  const [pacientes, setPacientes] = useState([]);
  const [paciente, setPaciente] = useState({});

  useEffect(() => {
    const obtenerPacientes = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await clienteAxios("/pacientes", config);
        setPacientes(data);
      } catch (error) {
        console.log(error);
      }
    };
    obtenerPacientes();
  }, []);

  const guardarPaciente = async (paciente) => {
    console.log(paciente);

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    if (paciente.id) {
      try {
        const { data } = await clienteAxios.put(
          `/pacientes/${paciente.id}`,
          paciente,
          config
        );
        const pacienteActualizado = pacientes.map((pacienteState) =>
          pacienteState._id === data._id ? data : pacienteState
        );
        setPacientes(pacienteActualizado);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const { data } = await clienteAxios.post(
          "/pacientes",
          paciente,
          config
        );
        const { createdAt, updatedAt, __v, ...pacienteAlmacenado } = data;
        setPacientes([pacienteAlmacenado, ...pacientes]);
      } catch (error) {
        console.log(error.response.data.msg);
      }
    }
  };

  const setEdicion = (paciente) => {
    setPaciente(paciente);
  };

  const eliminarPaciente = async (id) => {
    console.log(id);

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const confirmar = confirm("¿Confirmas que deseas eliminar ?");
    console.log(confirmar);

    if (confirmar) {
      try {
        console.log("estoy aca");

        const { data } = await clienteAxios.delete(`/pacientes/${id}`, config);
        console.log("aqui 2");

        const pacientesActualizado = pacientes.filter(
          (pacienteState) => pacienteState._id !== id
        );
        setPacientes(pacientesActualizado);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <PacienteContext.Provider
      value={{
        pacientes,
        guardarPaciente,
        setEdicion,
        paciente,
        eliminarPaciente,
      }}
    >
      {children}
    </PacienteContext.Provider>
  );
};

export { PacientesProvider };

export default PacienteContext;
