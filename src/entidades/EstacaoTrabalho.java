package entidades;

public class EstacaoTrabalho extends Espaco {
    private static final long serialVersionUID = 1L;

    public EstacaoTrabalho(String id, String nome, double valorHora) {
        super(id, nome, valorHora);
    }

    @Override
    public String getTipo() {
        return "Estação de Trabalho";
    }

    @Override
    public String getDescricaoCompleta() {
        return "Estação de Trabalho: " + getNome() + " (ID: " + getId() + ") - Valor/Hora: R$" + String.format("%.2f", getValorHora());
    }
}
