package entidades;

public class SalaReuniao extends Espaco {
    private static final long serialVersionUID = 1L;

    public SalaReuniao(String id, String nome, double valorHora) {
        super(id, nome, valorHora);
    }

    @Override
    public String getTipo() {
        return "Sala de Reunião";
    }

    @Override
    public String getDescricaoCompleta() {
        return "Sala de Reunião: " + getNome() + " (ID: " + getId() + ") - Valor/Hora: R$" + String.format("%.2f", getValorHora());
    }
}
