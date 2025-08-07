package entidades;

public class Estacionamento implements ServicoAdicional {
    private static final long serialVersionUID = 1L;
    private int duracaoHoras;
    private double valorPorHora = 7.5; // Exemplo de valor por hora

    public Estacionamento(int duracaoHoras) {
        this.duracaoHoras = duracaoHoras;
    }

    @Override
    public String getDescricao() {
        return "Estacionamento (" + duracaoHoras + " horas)";
    }

    @Override
    public double getValorTotal() {
        return duracaoHoras * valorPorHora;
    }
}