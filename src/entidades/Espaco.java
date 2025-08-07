package entidades;

import java.io.Serializable;

public abstract class Espaco implements Serializable {
    private static final long serialVersionUID = 1L;
    protected String id;
    protected String nome;
    protected double valorHora;
    protected boolean disponivel;

    public Espaco(String id, String nome, double valorHora) {
        this.id = id;
        this.nome = nome;
        this.valorHora = valorHora;
        this.disponivel = true; // Por padrão, um espaço é criado como disponível
    }

    // Getters
    public String getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public double getValorHora() {
        return valorHora;
    }

    public boolean isDisponivel() {
        return disponivel;
    }

    // Setters
    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setValorHora(double valorHora) {
        this.valorHora = valorHora;
    }

    public void setDisponivel(boolean disponivel) {
        this.disponivel = disponivel;
    }

    // Métodos abstratos
    public abstract String getTipo();
    public abstract String getDescricaoCompleta();

    @Override
    public String toString() {
        return "Espaço [ID=" + id + ", Nome=" + nome + ", Valor/Hora=" + valorHora +
                ", Disponível=" + disponivel + "]";
    }
}
