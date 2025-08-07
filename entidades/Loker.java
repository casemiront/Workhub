package entidades;

public class Locker implements ServicoAdicional {
    private static final long serialVersionUID = 1L;
    private int quantidade;
    private double valorPorUnidade = 10.0; // Exemplo de valor por unidade

    public Locker(int quantidade) {
        this.quantidade = quantidade;
    }

    @Override
    public String getDescricao() {
        return "Locker (x" + quantidade + ")";
    }

    @Override
    public double getValorTotal() {
        return quantidade * valorPorUnidade;
    }
}
