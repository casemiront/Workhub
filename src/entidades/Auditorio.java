package entidades;

public class Auditorio extends Espaco {
    private static final long serialVersionUID = 1L;

    public Auditorio(String id, String nome, double valorHora) {
        super(id, nome, valorHora);
    }

    @Override
    public String getTipo() {
        return "Auditório";
    }

    @Override
    public String getDescricaoCompleta() {
        return "Auditório: " + getNome() + " (ID: " + getId() + ") - Valor/Hora: R$" + String.format("%.2f", getValorHora());
    }
}
