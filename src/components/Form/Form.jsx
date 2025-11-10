import { useState } from "react";
import styles from "./Form.module.css";
import Input from "./Input/Input";
import Button from "./Button/Button";
import stylesInput from "./Input/Input.module.css";

const Form = () => {
  const [errors, setErrors] = useState({
    historia: "",
    objetivo: "",
    preCondicoes: "",
  });
  const [contexto, setContexto] = useState({
    historia: "",
    objetivo: "",
    preCondicoes: "",
  });
  const validate = (name, value) => {
    if (value.trim().length === 0) {
      setErrors((prev) => ({ ...prev, [name]: "Preencha um valor" }));
      return false;
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
      return true;
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    const isHistoriaValid = validate("historia", contexto.historia);
    const isObjetivoValid = validate("objetivo", contexto.objetivo);
    const isPreValid = validate("preCondicoes", contexto.preCondicoes);

    if (isHistoriaValid && isObjetivoValid && isPreValid) {
      console.log("✅ Todos os campos válidos:", contexto);
    } else {
      console.log("❌ Existem campos inválidos");
    }
  };
  const handleChangeContexto = (e) => {
    const { name, value } = e.target;
    setContexto((prev) => ({ ...prev, [name]: value }));
    validate(name, value);
  };
  const handleAutoNumbering = (e) => {
    const textarea = e.target;
    const { name, value, selectionStart } = textarea;

    if (value.trim() === "" && e.key !== "Backspace" && e.key.length === 1) {
      e.preventDefault();
      const newValue = `1. ${e.key}`;
      setContexto((prev) => ({ ...prev, [name]: newValue }));
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();

      const numLinhas = value.split("\n").length;
      const novaLinha = `\n${numLinhas + 1}. `;
      const novoTexto =
        value.substring(0, selectionStart) +
        novaLinha +
        value.substring(selectionStart);

      setContexto((prev) => ({ ...prev, [name]: novoTexto }));

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd =
          selectionStart + novaLinha.length;
      }, 0);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.titleContainer}>
          <h1>Contexto de Teste</h1>
        </div>
        <div className={styles.formContainer}>
          <Input
            label="História"
            type="text"
            name="historia"
            value={contexto.historia}
            onChange={handleChangeContexto}
            onBlur={(e) => validate(e.target.name, e.target.value)}
            error={errors.historia}
          />
          <Input
            label="Objetivo"
            type="text"
            name="objetivo"
            value={contexto.objetivo}
            onChange={handleChangeContexto}
            onBlur={(e) => validate(e.target.name, e.target.value)}
            error={errors.objetivo}
          />
          <div className={stylesInput.wrapper}>
            <label htmlFor="preCondicoes" className={stylesInput.label}>
              Pré Condições
            </label>
            <textarea
              id="preCondicoes"
              name="preCondicoes"
              className={stylesInput.textarea}
              value={contexto.preCondicoes}
              onChange={handleChangeContexto}
              onKeyDown={handleAutoNumbering}
              onBlur={(e) => validate(e.target.name, e.target.value)}
            />
            {errors.preCondicoes && (
              <p className={stylesInput.error}>{errors.preCondicoes}</p>
            )}
          </div>

          <Button style={{ marginTop: "40px" }}>Enviar</Button>
        </div>
      </form>
      <div style={{ marginTop: "1rem" }}>
        <strong>Debug:</strong>
        <pre>{JSON.stringify(contexto, null, 2)}</pre>
      </div>
    </>
  );
};

export default Form;
