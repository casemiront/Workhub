package entidades;

public class RecebimentoCorrespondencia implements ServicoAdicional {
    private static final long serialVersionUID = 1L;
    private double valor = 15.0; // Exemplo de valor fixo

    @Override
    public String getDescricao() {
        return "Recebimento de Correspondência";
    }

    @Override
    public double getValorTotal() {
        return valor;
    }
}
