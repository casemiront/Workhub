package entidades;

public class CafePremium implements ServicoAdicional {
    private static final long serialVersionUID = 1L;
    private double valor = 5.0; // Exemplo de valor fixo para café premium

    @Override
    public String getDescricao() {
        return "Café Premium";
    }

    @Override
    public double getValorTotal() {
        return valor;
    }
}

